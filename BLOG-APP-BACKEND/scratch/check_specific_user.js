import mongoose from 'mongoose';
import { UserTypeModel } from '../models/UserModel.js';
import { config } from 'dotenv';
config();

async function checkUser(email) {
  try {
    await mongoose.connect(process.env.DB_URL);
    const user = await UserTypeModel.findOne({ email });
    if (user) {
        console.log('User found:', JSON.stringify(user, null, 2));
    } else {
        console.log('User not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser('xyz@gmail.com');
