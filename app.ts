import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { multerFilter, multerStorage } from "./utils/upload";
import {
  handleFileUploadAndParse,
  handleGenerationController,
} from "./controllers/handleGenerationController";
import AppError from "./utils/appError";
import cors from "cors";
import globalErrorHandler from "./controllers/errorController";

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

app.get("/", (_, res: Response) => {
  res.status(200).send("its all good baby baby");
});

app.post("/upload-file", upload.single("document"), handleFileUploadAndParse);

app.post("/get-related-data", handleGenerationController);

app.all("*", (req: Request, _: Response, next: NextFunction) => {
  return next(
    new AppError(`cannot find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

export default app;
