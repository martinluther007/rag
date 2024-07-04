import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { getRelatedData, loadFileToVectorDB } from "../generatecodechain";

export const handleGenerationController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await getRelatedData(req.body.query);
    res.status(200).send({
      data,
    });
  }
);

export const handleFileUploadAndParse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await loadFileToVectorDB();
    res.status(201).json({
      status: "success",
      message: "message loaded",
    });
  }
);
