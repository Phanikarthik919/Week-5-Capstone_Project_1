import exp from 'express'
import { register, authenticate } from '../Services/authService.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { config } from 'dotenv'
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';

config();

export const authorRoute = exp.Router();

//Register author (public)
authorRoute.post('/users', async (req, res, next) => {
  try {
    //get user obj from req
    let userObj = req.body;
    //call register
    const newUserObj = await register({ ...userObj, role: "AUTHOR" });
    //send response
    res.status(201).json({ message: "author created Successfully", payload: newUserObj });
  } catch (err) {
    next(err);
  }
})


//create article (protected Route)
authorRoute.post("/articles", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
  try {
    // get article from req
    const article = req.body;
    // create article document
    const newArticleDoc = new ArticleModel(article);
    // save
    const createdArticleDoc = await newArticleDoc.save();
    // send res
    res.status(201).json({ message: "Article created successfully", payload: createdArticleDoc });
  } catch (err) {
    next(err);
  }
})

//read articles of author (protected route)
authorRoute.get("/articles/:authorId", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
  try {
    //get author id
    let aid = req.params.authorId;
    //read articles by this author
    let articleInfo = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email")
    //send res
    res.status(201).json({ message: "Article found successfully", payload: articleInfo });
  } catch (err) {
    next(err);
  }
})
//update Article (protected route)
authorRoute.put("/articles/", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => { //role should be assigned by backend(server)
  try {
    let { articleId, title, category, content, author } = req.body;
    //find article
    let articleofDB = await ArticleModel.findOne({ _id: articleId, author: author });
    if (!articleofDB) {
      return res.status(404).json({ message: "Article not found" });
    }
    const updatedArticle = await ArticleModel.findByIdAndUpdate(articleId, { $set: { title, category, content } }, { new: true });
    //send res
    res.status(200).json({ message: "Article updated successfully", payload: updatedArticle });
  } catch (err) {
    next(err);
  }
})

//delete (soft delete) article (protected route)
authorRoute.put("/articles/deactivate", verifyToken("AUTHOR"), checkAuthor, async (req, res, next) => {
  try {
    //get modified article from request
    let { author, article_id, isArticleActive } = req.body;
    //find the article
    let articleOfDB = await ArticleModel.findOne({ _id: article_id, author: author });
    //update the article
    if (!articleOfDB) {
      return res.status(401).json({ message: "Article not found" });
    }
    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(article_id,
      { $set: { isArticleActive: false } },
      { new: true })
    //send res
    res.status(201).json({ message: "Article Decativated successfully", payload: updatedArticle });
  } catch (err) {
    next(err);
  }
})