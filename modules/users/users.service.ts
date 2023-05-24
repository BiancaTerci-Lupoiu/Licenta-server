// This file will contain all the logic of the routes

import UsersDal from "./users.dal";
import {
  AddUserBody,
  IUserModel,
  IUserModelWithoutSensitiveInfo,
  UpdateUserBody,
} from "./users.models";
import {
  ControllerError,
  ControllerResponse,
  ResponseFactory,
} from "../../toolkit";
import { Request as ExpressRequest } from "express";

export default class UsersService {
  public static async getUsersList(): Promise<
    ControllerResponse<IUserModel[] | ControllerError>
  > {
    const users = await UsersDal.getUsersList();
    if (!users) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(users);
  }

  public static async getUserById(
    userId: string
  ): Promise<
    ControllerResponse<IUserModelWithoutSensitiveInfo | ControllerError>
  > {
    const user = await UsersDal.getUserById(userId);
    if (!user) {
      return ResponseFactory.createNotFoundError();
    }

    return ResponseFactory.createResponse(user);
  }

  public static async addUser(
    userDetails: AddUserBody
  ): Promise<ControllerResponse<IUserModel | ControllerError>> {
    const existingUser = await UsersDal.getUserByEmail(userDetails.email);
    if (existingUser) {
      return ResponseFactory.createBadRequestError(
        "A user with this email already exists"
      );
    }

    const newUser = await UsersDal.addNewUser({
      ...userDetails,
      confirmationToken: "",
    });

    if (newUser) {
      return ResponseFactory.createResponse(newUser);
    }

    return ResponseFactory.createInternalServerError();
  }

  public static async updateUser(
    request: ExpressRequest,
    userDetails: UpdateUserBody,
    userId: string
  ): Promise<
    ControllerResponse<IUserModelWithoutSensitiveInfo | ControllerError>
  > {
    if (
      !request.authenticatedUser ||
      request.authenticatedUser._id.toString() !== userId
    ) {
      return ResponseFactory.createUnauthorizedError();
    }
    for (const property in userDetails) {
      if (!userDetails[property as keyof UpdateUserBody]) {
        delete userDetails[property as keyof UpdateUserBody];
      }
    }
    console.log(userDetails.picture);
    const userUpdated = await UsersDal.updateUser(userId, userDetails);
    if (!userUpdated) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(userUpdated);
  }
}
