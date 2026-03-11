import exp from "express"; //exp is a function
import {connect} from 'mongoose'
import {config} from 'dotenv'

import { userRoute } from './APIs/UserAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from "./APIs/commonAPI.js";
import cookieParser from "cookie-parser";

config();    //process.env

const app = exp()
//add body parser middleware
app.use(exp.json()) //req.body ????? what is exp.json()
//cokiee parser
app.use(cookieParser());
//connect to database
//connect APIs
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use("/common-api",commonRouter)

const connectDB = async()=>{
  try{
    await connect(process.env.DB_URL)
  console.log("DB connection success")
  //start http server
  app.listen(process.env.PORT,()=>console.log("server started"))
  }catch(err){
    console.log("Err in DB connection", err)
  }
}

app.post('/logout',(req,res)=>{
  //clear cookie named 'token'
  res.clearCookie('token',{
    httpOnly:true,
    secure: false,
    sameSite: 'lax'
  });

  res.status(200).json({message:"Logged out Successfully"});
})

connectDB()

//dealing with invalid path
app.use((req,res,next)=>{
  res.json({message:`${req.url} Invalid Path`})
});
//error handling middleware
app.use((err,req,res,next)=>{
  console.log("err",err);
  res.json({message:err.message})
})