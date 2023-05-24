// The Controller files will mostly be used for:
// - getting the Request, Body and Path parameters and passing them to the service
// - validating those parameters
// - Generating the Swagger Documentation

import { Request, Response, Tags, Route, Post, Body, Path, Patch } from "tsoa";
import { Request as ExpressRequest } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ControllerResponse,
  ControllerError,
  ExceptionSafe,
  controllerExceptionHandler,
  ErrorMessageCode,
  HttpErrorMessages,
} from "../../toolkit";
import {
  LoginUserRequestBody,
  LoginUserResponseBody,
  RegisterUserResponseBody,
} from "./authentication.model";
import AuthenticationService from "./authentication.service";
import { AddUserBody } from "../users/users.models";

@Tags("Authentication")
@Route("auth")
@ExceptionSafe(controllerExceptionHandler)
export default class AuthenticationController {
  @Post("/login")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    "Bad Request"
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async loginUser(
    @Request() _request: ExpressRequest,
    @Body() userCredentials: LoginUserRequestBody
  ): Promise<ControllerResponse<LoginUserResponseBody | ControllerError>> {
    console.log("Try to log in user " + userCredentials.email);
    return await AuthenticationService.loginUser(userCredentials);
  }

  @Post("/login")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    "Bad Request"
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async signupUser(
    @Request() _request: ExpressRequest,
    @Body() userDetails: AddUserBody
  ): Promise<ControllerResponse<RegisterUserResponseBody | ControllerError>> {
    return await AuthenticationService.signupUser(userDetails);
  }

  @Post("/confirm/{confirmationToken")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    "Bad Request"
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async confirmRegistration(
    @Path() confirmationToken: string
  ): Promise<ControllerResponse<string | ControllerError>> {
    console.log("confirm registration");
    return await AuthenticationService.confirmRegistration(confirmationToken);
  }
}
