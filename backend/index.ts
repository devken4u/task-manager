import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import databaseConnection from "./config/databaseConnection";
import userRoutes from "./routes/userRoutes";
import emailVerificationRoutes from "./routes/emailVerificationRoutes";
import taskRoutes from "./routes/taskRoutes";
import cors from "cors";
import { Request, Response } from "express";

const app = express();

app.use(
  cors({
    origin: [
      "https://task-manager-frontend-eight-omega.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Task Manager API Made by devken");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/email-verification", emailVerificationRoutes);
app.use("/api/v1/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // connect to database first
    await databaseConnection();
    // listen to port
    app.listen(PORT, () => {
      console.log(`Server is up at port -> ${PORT}`);
    });
  } catch (error) {
    console.error(`Can't start server -> ${error}`);
  }
};

startServer();
