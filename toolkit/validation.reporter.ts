import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ResponseFactory } from "./response-factory";

export function validationReporter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errorMessages: string[] = result.array().map((error) => error.msg);

    const response = ResponseFactory.createBadRequestError(
      errorMessages.join(";")
    );
    return res.status(response.statusCode).send(response.body);
  }

  next();
}

export enum CommonErrorCodes {
  TOO_LONG = "too long",
  TOO_SHORT = "too short",
  REQUIRED = "required",
  NOT_FOUND = "not found",
  NOT_EXIST = "not exist",
  NOT_VALID_FORMAT = "not valid format",
  ALREADY_EXISTS = "already exists",
  NOT_EMPTY = "not empty",
  NOT_VALID_VALUE = "not valid value",
}
