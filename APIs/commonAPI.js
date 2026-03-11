import exp from 'express'
import { authenticate } from "../Services/authService.js"
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserTypeModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

export const commonRouter = exp.Router();
//login
commonRouter.post("/login", async (req, res) => {
  //get user credential object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save token as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  const newUserObj = userCred;
  delete newUserObj.password;
  //send res
  res.status(201).json({ message: "User Logged in Successfully", payload: newUserObj })
})
//logout
commonRouter.get("/logout", async (req, res) => {
  // clear the cookie named 'token
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'User Logged out succesfully' });
})

//change password
commonRouter.put("/change-password", verifyToken, async (req, res) => {
  let email = req.body.email;
  //get current password and new password
  let { password, new_password } = req.body;
  if(password === new_password){
    return res.status(201).json({message:"new password must not be same as old"});
  }
  //check the current password is correct
  let user = await UserTypeModel.findOne({ email });
  if(!user){
    return res.status(401).json({message:"User not found"})
  }
  const result = await bcrypt.compare(password, user.password);
  if (result === false) {
    return res.status(401).json({ message: "Incorrect password" })
  }
  //replace the current password with new password
  const hashedPassword = await bcrypt.hash(new_password, 10);
  user.password = hashedPassword;
  await user.save();
  //send res
  res.status(200).json({ message: "Password Updated Successfully" })
})
