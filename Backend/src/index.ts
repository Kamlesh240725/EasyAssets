import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { connectDB } from "./lib/connectDB";
import authRoutes from "./routes/authRouter";
import cookieParser from "cookie-parser";
import { setupSwagger } from "../swagger";
import morgan = require("morgan");
import assets from "./routes/assetsRouter";

const app = express();
const port = process.env.PORT || 5000;
app.use(
  morgan("dev", {
    skip: (req: Request, res: Response) => {
      return req.originalUrl.startsWith("/api-docs");
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//For API Docs using Swagger UI
setupSwagger(app);

app.use("/api/auth", authRoutes);

app.use("/api/assets", assets);

app.get("/", (req: Request, res: Response) => {
  res.json(console.log(req.path));
});

app.get("/api-docs", (req: Request, res: Response) => {
  res.json(console.log("test", req.path));
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${process.env.PORT}/api-docs`);
  connectDB(process.env.MONGODB_URI as string);
});
