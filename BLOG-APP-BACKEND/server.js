import exp from "express"; 
import cors from "cors";
import { connect } from 'mongoose'
import { config } from 'dotenv'

import { userRoute } from './APIs/UserAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from "./APIs/commonAPI.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

config();

const app = exp()

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  credentials: true
}))
app.use(exp.json())
app.use(cookieParser());

// Routes
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use("/common-api", commonRouter)

// DB Connection & Server Start
const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("Critical: DB_URL is missing!");
      process.exit(1);
    }
    await connect(dbUrl);
    console.log("DB connection success");

    const port = process.env.PORT || 5005;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("Critical: Err in DB connection", err);
    process.exit(1);
  }
}

connectDB();

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.url} Invalid Path` })
});

// Root Error Handler
app.use(errorHandler);

export default app; 