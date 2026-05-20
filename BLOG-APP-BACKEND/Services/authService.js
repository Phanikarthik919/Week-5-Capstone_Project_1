import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import {config} from 'dotenv'
config()

//register function
export const register = async (userObj) => {
  //Create document
  const userDoc = new UserTypeModel(userObj);
  //validate for emprty passwords
  await userDoc.validate();
  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  //save
  const created = await userDoc.save();
  //convert document to object to remove password
  const newUserObj = created.toObject();
  //remove password
  delete newUserObj.password;
  //return user obj without password
  return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Authenticating email:", normalizedEmail);
    //check user with email & role
  const user = await UserTypeModel.findOne({ email: normalizedEmail });
  if (!user) {
    console.log("User not found in DB for email:", normalizedEmail);
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }
  
  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match result:", isMatch);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
  //check isACtive state
   if (user.isActive===false) {
    const err = new Error("Your account blocked. Plz contact Admin");
    err.status = 403;
    throw err;
  }

  //generate token
  const token = jwt.sign({ userId: user._id, 
    role: user.role, email: user.email ,firstName:user.firstName , lastName:user.lastName,profileImageUrl:user.profileImageUrl}, 
    process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};