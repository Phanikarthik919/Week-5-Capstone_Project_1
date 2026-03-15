import exp from "express"; // exp is a function
import cors from "cors";
import { connect } from 'mongoose'
import { config } from 'dotenv'

import { userRoute } from './APIs/UserAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from "./APIs/commonAPI.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

config();    //process.env

const app = exp()

//use cors middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true // Allows any origin in production for simplicity, or you can put your specific Vercel URL here
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
//add body parser middleware
app.use(exp.json()) //req.body ????? what is exp.json()
//cokiee parser
app.use(cookieParser());
//connect to database
//connect APIs
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use("/common-api", commonRouter)

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      console.error("DB_URL is missing in environment variables!");
      return;
    }
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    // Only listen on a port in local development
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 4000;
      app.listen(port, () => console.log(`Server started on port ${port}`));
    }
  } catch (err) {
    console.error("Critical: Err in DB connection", err);
  }
}

// Export the app for Vercel
export default app;

// Initialize connection
connectDB();

//dealing with invalid path
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.url} Invalid Path` })
});

//error handling middleware
app.use(errorHandler);