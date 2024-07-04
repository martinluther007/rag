import multer from "multer";
import { Request } from "express";
import AppError from "./appError";

export const multerStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./");
  },
  filename(req, file, callback) {
    const ext = file.originalname.split(".")[1];
    callback(null, `facts.${ext}`);
  },
});

export const multerFilter = (_: Request, file: any, cb: Function) => {
  console.log(file);
  if (
    file.mimetype.startsWith("text") ||
    file.mimetype.startsWith("application")
  ) {
    cb(null, true);
  } else {
    cb(new AppError(`Please upload an allowed file`, 400), false);
  }
};
