import { Request, Response, NextFunction } from "express";

export const validateFileExtension = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  const extension = file!.mimetype.split("/").pop();
  const allowedExtensions = ["jpg", "jpeg", "png"];
  if (!allowedExtensions.includes(extension!)) {
    return res.status(400).json({
      message: "Invalid file format. Only JPG, JPEG and PNG files are allowed.",
    });
  }
  next();
};
