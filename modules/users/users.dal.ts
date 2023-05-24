// Data Access Layer for the Users
// This will contain all the database queries

import crypto from "crypto";
import {
  NewUser,
  UserRoles,
  IUserModel,
  AddUserBody,
  UpdateUserBody,
  IUserModelWithId,
  AddUserBodyWithRegistrationToken,
  AccountStatus,
  IUserModelWithoutSensitiveInfo,
} from "./users.models";
import { ExceptionSafe, dalExceptionHandler } from "../../toolkit";
import { UserData } from "./users.schema";
import { ObjectId } from "mongodb";

@ExceptionSafe(dalExceptionHandler)
export default class UsersDal {
  public static async getUsersList(): Promise<IUserModel[] | null> {
    const users = (await UserData.find()) || null;

    return users;
  }

  public static async getUserById(
    userId: string
  ): Promise<IUserModelWithoutSensitiveInfo | null> {
    return (
      (await UserData.findById(new ObjectId(userId), { password: 0 })) || null
    );
  }

  public static async getUserByEmail(
    email: string
  ): Promise<IUserModelWithId | null> {
    return await UserData.findOne({ email });
  }

  public static async addNewUser(
    userDetails: AddUserBodyWithRegistrationToken
  ): Promise<IUserModelWithId | null> {
    const newUser: IUserModelWithId = (await UserData.create(
      userDetails
    )) as unknown as IUserModelWithId;

    return newUser;
  }

  public static async updateUser(
    userId: string,
    userDetails: UpdateUserBody
  ): Promise<IUserModelWithoutSensitiveInfo | null> {
    const updatedUser: IUserModelWithoutSensitiveInfo | null =
      await UserData.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: userDetails },
        { returnOriginal: false, projection: { password: 0 } }
      );

    return updatedUser;
  }

  public static async activateAccount(
    confirmationToken: string
  ): Promise<IUserModel | null> {
    const user = await UserData.findOneAndUpdate(
      { confirmationToken },
      { $set: { status: AccountStatus.ACTIVE } }
    );

    return user;
  }
}
