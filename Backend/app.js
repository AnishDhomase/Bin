import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import emailRouter from "./routes/email.routes.js";
import assetRouter from "./routes/asset.routes.js";
import { dbConnect } from "./db/db.js";



const app = express();

// Connect to the database
dbConnect();

// Middlewares
// app.use(cors()); // Cross-Origin Resource Sharing

const allowedOrigin = "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); //Parses JSON request bodies into req.body
app.use(express.urlencoded({ extended: true })); //Parses URL-encoded form data (e.g., from HTML forms) into req.body.
app.use(cookieparser()); //Parses cookies from the request and makes them available in req.cookies

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRouter);
app.use("/email", emailRouter);
app.use("/asset", assetRouter);

export default app;
