import exp from 'express'
import { register, authenticate } from '../Services/authService.js';
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import {config} from 'dotenv'
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';  

config(); 

export const authorRoute = exp.Router();

//Register author (public)
authorRoute.post('/users',async(req,res)=>{
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({...userObj , role:"AUTHOR"});
  //send response
  res.status(201).json({message:"author created Successfully",payload:newUserObj});
})


//create article (protected Route)
authorRoute.post("/articles", verifyToken,checkAuthor, async(req,res)=>{
  // get article from req
  const article = req.body;
  // check for the author id
  // let author = await UserTypeModel.findById(article.author);
  // if(!author || author.role!=="AUTHOR"){
  //     return res.status(401).json({message:"Invalid Autho"})
  // }
  // create article document
  const newArticleDoc = new ArticleModel(article);
  // save
  const createdArticleDoc = await newArticleDoc.save();
  // send res
  res.status(201).json({message:"Article created successfully", payload: createdArticleDoc});
})

//read articles of author (protected route)
authorRoute.get("/articles/:authorId", verifyToken ,checkAuthor, async(req,res)=>{
  //get author id
  let aid = req.params.authorId;
  //check the author
  // let author = await UserTypeModel.findById(aid);
  // if(!author || author.role !== "AUTHOR" ){
  //     return res.status(401).json({message:"Invalid Author_Id"})
  // }
  //read articles by this author
  let articleInfo = await ArticleModel.find({author:aid,isArticleActive:true}).populate("author" ,"firstName email")
  //send res
  res.status(201).json({message:"Article found successfully", payload: articleInfo});
})
//update Article (protected route)
authorRoute.put("/articles/", verifyToken ,checkAuthor,async(req,res)=>{ //role should be assigned by backend(server)
    //get modified article object from request body
    //update the article  
    //even it is blocked it can be edited
    let {articleId,title,category,content,author}=req.body;
    //find article
    let articleofDB=await ArticleModel.findOne({_id:articleId,author:author});
    if(!articleofDB){
        return res.status(404).json({message:"Article not found"});
    }
    const updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,{$set:{title,category,content}},{new:true});
    //send res
    res.status(200).json({message:"Article updated successfully",payload:updatedArticle});
})

//delete (soft delete) article (protected route)
authorRoute.put("/articles/deactivate",checkAuthor, async(req,res)=>{
  //get modified article from request
  let {author , article_id ,isArticleActive} = req.body;
  //find the article
  let articleOfDB = await ArticleModel.findOne({_id:article_id,author:author});
  //update the article
  if(!articleOfDB){
    return res.status(401).json({message:"Article not found"});
  }
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(article_id,
    {$set:{isArticleActive:false}}, 
    {new:true})
  //send res
  res.status(201).json({message:"Article Decativated successfully", payload: updatedArticle});
})