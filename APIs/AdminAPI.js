import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
export const adminRoute = exp.Router();



// Read all articles (optional)
// block user roles
adminRoute.put("/block-user/:id",async(req,res)=>{
  //get the id
  let userid = req.params.id;
  //update the user
  let updatedUser = await UserTypeModel.findByIdAndUpdate(userid,{$set:
    {isActive:false}},
    {new:true});
  //send res
  res.status(201).json({message:"User blocked successfully",payload:updatedUser});
})  
// unblock user roles
adminRoute.put("/unblock-user/:id",async(req,res)=>{
  //get the id
  let userid = req.params.id;
  //update the user
  let updatedUser = await UserTypeModel.findByIdAndUpdate(userid,{$set:
    {isActive:true}},
    {new:true});
  //send res
  res.status(201).json({message:"User unblocked successfully",payload:updatedUser});
})  