import exp from "express"; // exp is a function
import cors from "cors";
import { connect } from 'mongoose'
import { config } from 'dotenv'

import { userRoute } from './APIs/UserAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from "./APIs/commonAPI.js";
import cookieParser from "cookie-parser";

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
    await connect(process.env.DB_URL)
    console.log("DB connection success")
    //start http server
    app.listen(process.env.PORT, () => console.log("server started"))
  } catch (err) {
    console.log("Err in DB connection", err)
  }
}

app.post('/logout', (req, res) => {
  //clear cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });

  res.status(200).json({ message: "Logged out Successfully" });
})

// Export the app for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
  connectDB();
} else {
  // In production (Vercel), we just need to ensure DB is connected
  connect(process.env.DB_URL)
    .then(() => console.log("DB connection success (Production)"))
    .catch(err => console.log("Err in DB connection", err));
}

//dealing with invalid path
app.use((req, res, next) => {
  res.json({ message: `${req.url} Invalid Path` })
});
//error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // handle custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});