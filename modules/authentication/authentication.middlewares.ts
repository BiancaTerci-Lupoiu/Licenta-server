import { Request, Response, NextFunction } from "express";
import UsersDal from "../users/users.dal";
import jwt from "jsonwebtoken";
import { ResponseFactory } from "../../toolkit";
import { config } from "../../config";
import {
  IUserModelWithoutSensitiveInfo,
  UserRoles,
} from "../users/users.models";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    // verify request has token
    if (!token) {
      const { statusCode, body } =
        ResponseFactory.createUnauthorizedError("Missing token");
      return res.status(statusCode).send(body);
    }

    // remove Bearer if using Bearer Authorization mechanism
    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice("bearer".length).trim();
    }

    // check if token is valid
    jwt.verify(token, config.secretToken, async (err, decodedToken) => {
      if (err) {
        const { statusCode, body } = ResponseFactory.createUnauthorizedError(
          err.message
        );
        return res.status(statusCode).send(body);
      }
      // check if id exists
      const tokenWithId = decodedToken as { userId: string };
      const userId: string = tokenWithId.userId;
      const user = await UsersDal.getUserById(userId);
      if (!user) {
        const { statusCode, body } = ResponseFactory.createUnauthorizedError();
        return res.status(statusCode).send(body);
      }
      req.authenticatedUser = user;
      next();
    });
  } catch (error) {
    const { statusCode, body } = ResponseFactory.createUnauthorizedError();
    return res.status(statusCode).send(body);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUserModelWithoutSensitiveInfo | undefined =
      req.authenticatedUser;

    if (!user || user === undefined) {
      const { statusCode, body } = ResponseFactory.createUnauthorizedError();
      return res.status(statusCode).send(body);
    }

    if (user.role !== UserRoles.ADMIN) {
      const { statusCode, body } = ResponseFactory.createUnauthorizedError();
      return res.status(statusCode).send(body);
    }

    next();
  } catch (error) {
    const { statusCode, body } = ResponseFactory.createUnauthorizedError();
    return res.status(statusCode).send(body);
  }
};
