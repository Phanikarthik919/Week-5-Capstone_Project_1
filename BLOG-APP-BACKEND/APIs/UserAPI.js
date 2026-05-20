import exp from 'express';
import jwt from "jsonwebtoken";
import { register, authenticate } from '../Services/authService.js'
export const userRoute = exp.Router();
import { config } from 'dotenv'
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';

import upload from '../Config/multer.js';
import { uploadToCloudinary } from '../Config/clodinaryUpload.js';
import cloudinary from '../Config/cloudinary.js';

config();

//Register user
userRoute.post(
    "/users",
    upload.single("profileImageUrl"),
    async (req, res, next) => {
        let cloudinaryResult;

        try {
            // get user obj
            let userObj = req.body;

            //  Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }

            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
            });

            res.status(201).json({
                message: "user created",
                payload: newUserObj,
            });

        } catch (err) {     //this catch block shows athe error and removes the image from cloudinary if it was uploaded

            // Step 3: rollback 
            if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
            }

            next(err); // send to your error middleware
        }

    }
);


//Read all articles ( protected route )
userRoute.get("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
    try {
        //read articles of all authors which are active
        const articles = await ArticleModel.find({ isArticleActive: true })
            .populate("author", "firstName lastName email")
            .populate("comments.user", "firstName lastName profileImageUrl")
            .sort({ createdAt: -1 });
        //send res
        res.status(200).json({ message: "all articles", payload: articles });
    } catch (err) {
        next(err);
    }
});

// Read a single article by ID (accessible by any logged-in user)
userRoute.get("/articles/:articleId", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const article = await ArticleModel.findOne({ _id: articleId, isArticleActive: true })
            .populate("author", "firstName lastName email")
            .populate("comments.user", "firstName lastName profileImageUrl");

        if (!article) {
            return res.status(404).json({ message: "Article not found or is inactive" });
        }

        res.status(200).json({ message: "Article found", payload: article });
    } catch (err) {
        next(err);
    }
});

//Add comment to an article(protected)
userRoute.put("/articles/comments", verifyToken("USER", "AUTHOR"), async (req, res) => {
    const { user, articleId, comment } = req.body;

    console.log("Adding comment - body user:", user, typeof user);
    console.log("Adding comment - token user:", req.user.userId, typeof req.user.userId);

    // Check if the user ID matches the logged-in user
    if (String(user) !== String(req.user.userId)) {
        return res.status(403).json({ 
            message: "Forbidden: Identity mismatch", 
            receivedId: user, 
            tokenId: req.user.userId 
        });
    }

    // Update article ONLY if it exists and is active
    let articleWithComment = await ArticleModel.findOneAndUpdate(
        { _id: articleId, isArticleActive: true },
        { $push: { comments: { user, comment } } },
        { new: true, runValidators: true }
    ).populate("author", "firstName lastName email")
     .populate("comments.user", "firstName lastName profileImageUrl");

    // If result is null, it means either articleId was wrong OR it was inactive
    if (!articleWithComment) {
        // Double check why it failed to give a specific error message
        const article = await ArticleModel.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        if (!article.isArticleActive) {
            return res.status(400).json({ message: "Cannot add comments: Article is inactive" });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Send success response
    res.status(200).json({ message: "Comment added successfully", payload: articleWithComment });
})