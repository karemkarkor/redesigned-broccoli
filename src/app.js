import express from "express";
import logger from "#config/looger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "#routes/auth.routes.js";

const app = express();

// Middleware Libraries
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", {stream: {write: (message)=> logger.info(message.trim()) }}));

// Routes
app.get("/", (req, res) => {
  logger.info("hello from Acquisition!");
  res.status(200).json({ msg: "running" });
});

app.get("/heath", (req,res)=> {
  res.status(200).json({
    Status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({ msg: "running" });
});

app.use("/api/auth", authRouter);

export default app;
