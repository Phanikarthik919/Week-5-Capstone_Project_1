import mongoose from 'mongoose';
import { UserTypeModel } from '../models/UserModel.js';
import { config } from 'dotenv';
config();

async function checkEmails() {
  try {
    await mongoose.connect(process.env.DB_URL);
    const users = await UserTypeModel.find({}, 'email');
    users.forEach(u => {
        console.log(`Email: "${u.email}", Length: ${u.email.length}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkEmails();
