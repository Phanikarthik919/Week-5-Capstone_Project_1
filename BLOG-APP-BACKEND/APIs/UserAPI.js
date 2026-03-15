import exp from 'express';
import jwt from "jsonwebtoken";
import { register, authenticate } from '../Services/authService.js'
export const userRoute = exp.Router();
import { config } from 'dotenv'
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';
config();

//Register user
userRoute.post('/users', async (req, res, next) => {
    try {
        //get user obj from req
        let userObj = req.body;
        //call register
        const newUserObj = await register({ ...userObj, role: "USER" });
        //send response
        res.status(201).json({ message: "user registered Successfully", payload: newUserObj });
    } catch (err) {
        next(err);
    }
})


//Read all articles ( protected route )
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true });
  //send res
  res.status(200).json({ message: "all articles", payload: articles });
});

//Add comment to an article(protected)
userRoute.put("/articles/comments", verifyToken("USER"), async (req, res) => {
    const { user, articleId, comment } = req.body;

    // Check if the user ID matches the logged-in user
    if (user !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden: Identity mismatch" });
    }

    // Update article ONLY if it exists and is active
    let articleWithComment = await ArticleModel.findOneAndUpdate(
        { _id: articleId, isArticleActive: true },
        { $push: { comments: { user, comment } } },
        { new: true, runValidators: true },
    );

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