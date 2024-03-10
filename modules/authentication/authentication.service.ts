// This file will contain all the logic of the routes

import UsersDal from "../users/users.dal";
import {
  AccountStatus,
  AddUserBody,
  IUserModel,
  IUserModelWithId,
} from "../users/users.models";
import {
  ControllerError,
  ControllerResponse,
  ResponseFactory,
} from "../../toolkit";
import {
  LoginUserRequestBody,
  LoginUserResponseBody,
  RegisterUserResponseBody,
} from "./authentication.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import sendEmail, { emailVerifiedPageContent } from "../utils/sendEmail";

export default class AuthenticationService {
  public static async loginUser(
    userCredentials: LoginUserRequestBody
  ): Promise<ControllerResponse<LoginUserResponseBody | ControllerError>> {
    const user: IUserModelWithId | null = await UsersDal.getUserByEmail(
      userCredentials.email
    );

    if (!user) {
      return ResponseFactory.createNotFoundError("User not found!");
    }

    if (user.status === AccountStatus.PENDING) {
      return ResponseFactory.createBadRequestError(
        "Pending Account. Please Verify Your Email!"
      );
    }

    const validPassword = await bcrypt.compare(
      userCredentials.password,
      user.password
    );
    if (!validPassword) {
      return ResponseFactory.createBadRequestError("Invalid email/password!");
    }

    const token: string = jwt.sign({ userId: user._id }, config.secretToken, {
      expiresIn: config.jwtExpire,
    });

    const responseBody: LoginUserResponseBody = {
      token: token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        iban: user.iban,
        picture: user.picture,
        address: user.address,
        role: user.role,
      },
    };
    return ResponseFactory.createResponse(responseBody);
  }

  public static async signupUser(
    userDetails: AddUserBody
  ): Promise<ControllerResponse<RegisterUserResponseBody | ControllerError>> {
    const existingUser = await UsersDal.getUserByEmail(userDetails.email);
    console.log(existingUser);

    if (existingUser) {
      return ResponseFactory.createBadRequestError(
        "A user with this email already exists"
      );
    }

    const confirmationToken = jwt.sign(
      { email: userDetails.email },
      config.secretToken
    );

    const user: IUserModelWithId | null = await UsersDal.addNewUser({
      ...userDetails,
      confirmationToken,
    });

    if (!user) {
      return ResponseFactory.createBadRequestError("Could not register user!");
    }

    const message = `Click the link to confirm your email <a href=http://localhost:${config.port}/api/auth/confirm/${confirmationToken}> Click here! </a>`;

    const emailSent = await sendEmail({
      message,
      subject: "Account confirmation",
      email: user.email,
    });

    if (!emailSent) {
      return ResponseFactory.createInternalServerError(
        "Email could not be sent!"
      );
    }

    return ResponseFactory.createResponse({
      message: "Check your email to activate your account!",
    });
  }

  public static async confirmRegistration(
    confirmationToken: string
  ): Promise<ControllerResponse<string | ControllerError>> {
    const user = await UsersDal.activateAccount(confirmationToken);

    if (!user) {
      return ResponseFactory.createBadRequestError("Invalid token!");
    }

    return ResponseFactory.createResponse(emailVerifiedPageContent);
  }
}
