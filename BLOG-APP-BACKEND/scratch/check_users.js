import mongoose from 'mongoose';
import { UserTypeModel } from '../models/UserModel.js';
import { config } from 'dotenv';
config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.DB_URL);
    const users = await UserTypeModel.find({}, 'email role firstName');
    console.log('Users in DB:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
