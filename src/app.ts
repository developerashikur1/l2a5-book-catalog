import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();

// cors connection
app.use(cors());

// parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// main route
app.use("/api/v1/", router);

// ? global error handler
app.use(globalErrorHandler);

// ? handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found!",
      },
    ],
  });
  next();
});

export default app;
