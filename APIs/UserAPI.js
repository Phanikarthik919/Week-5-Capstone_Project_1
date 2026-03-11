import exp from 'express';
import jwt from "jsonwebtoken";
import {register, authenticate} from '../Services/authService.js'
export const userRoute = exp.Router();
import {config} from 'dotenv'
import { ArticleModel } from '../models/ArticleModel.js';
import { UserTypeModel } from '../models/UserModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';  
config(); 

//Register user
userRoute.post('/users',async(req,res)=>{
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({...userObj , role:"USER"});
  //send response
  res.status(201).json({message:"user registered Successfully",payload:newUserObj});
})


//Read all articles ( protected route )
userRoute.get("/articles",verifyToken,async(req,res)=>{
    let articles=await ArticleModel.find()
    res.status(200).json({message:"Articles found successfully",payload:articles});
})

//Add comment to an article(protected)
userRoute.post("/articles/comments",verifyToken,async(req,res)=>{ //role should be assigned by backend(server))
    let {articleId,comment}=req.body;
    let user=req.user._id;
    let article=await ArticleModel.findById(articleId)
    if(!article){
        return res.status(404).json({message:"Article not found"});
    }
    let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,{$push:{comments:{user:user,comment:comment}}},{new:true});
    res.status(200).json({message:"Comment added successfully",payload:updatedArticle});
})