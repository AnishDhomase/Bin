import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import { dbConnect } from "./db/db.js";

// Load env variables for use
dotenv.config();

const app = express();

// Connect to the database
dbConnect();

// Middlewares
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); //Parses JSON request bodies into req.body
app.use(express.urlencoded({ extended: true })); //Parses URL-encoded form data (e.g., from HTML forms) into req.body.
app.use(cookieparser()); //Parses cookies from the request and makes them available in req.cookies

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRouter);

export default app;
