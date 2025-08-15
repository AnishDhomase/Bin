import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import userRouter from "./routes/User.routes.js";
import emailRouter from "./routes/email.routes.js";
import assetRouter from "./routes/asset.routes.js";
import { dbConnect } from "./db/db.js";
import { MINUTE, rateLimiter } from "./middlewares/rate-limiter.middleware.js";
import {
  CRON_JOB_AUTO_DELETE_TRASH_TIME,
  cronJobForAutoDeletionFromRecycleBinParmanently,
} from "./models/fileFolder.model.js";

const app = express();

// Connect to the database
dbConnect();

// Cron-job
setInterval(
  cronJobForAutoDeletionFromRecycleBinParmanently,
  CRON_JOB_AUTO_DELETE_TRASH_TIME
);

// Middlewares
// app.use(cors()); // Cross-Origin Resource Sharing
const allowedOrigin = "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); //Parses JSON request bodies into req.body
app.use(express.urlencoded({ extended: true })); //Parses URL-encoded form data (e.g., from HTML forms) into req.body.
app.use(cookieparser()); //Parses cookies from the request and makes them available in req.cookies

// Routes
app.get("/", rateLimiter(MINUTE, 5), (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRouter);
app.use("/email", emailRouter);
app.use("/asset", assetRouter);

export default app;
