import jwt from "jsonwebtoken";
import {config} from 'dotenv'
config(); 

export const verifyToken = async(req,res,next)=>{
  //read token from req
  let token = req.cookies.token; // { token:"" }
  console.log(token);
  if(token === undefined){
    return res.status(400).json({message:"Unauthorized req : Please Login"})
  }
  //verify the validity of token
  //verification of token is decoding the token
  //if token is decoded sucessfully then it is a valid token
  //else an error occered || it is not a valid token

  let decodedToken = jwt.verify(token,process.env.JWT_SECRET)

  //forward req to next middleware / route
  next();
}