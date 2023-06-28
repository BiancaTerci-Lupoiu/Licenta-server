import { Router, Request, Response, NextFunction } from "express";
import AuthenticationController from "./authentication.controller";
import cors from "cors";
import {
  validateLoginRequest,
  validateRegisterUserRequest,
} from "./authentication.validators";
import { validationResult } from "express-validator";
const router = Router();

router.use(cors({ origin: "*" }));
router.post(
  "/login",
  validateLoginRequest,
  async (req: Request, res: Response) => {
    const { statusCode, body } = await AuthenticationController.loginUser(
      req,
      req.body
    );
    //res.set("Access-Control-Allow-Origin", "*");
    res.status(statusCode).send(body);
  }
);

router.post(
  "/signup",
  validateRegisterUserRequest,
  async (req: Request, res: Response) => {
    const { statusCode, body } = await AuthenticationController.signupUser(
      req,
      req.body
    );
    res.status(statusCode).send(body);
  }
);

router.get(
  "/confirm/:confirmationToken",
  async (req: Request, res: Response) => {
    const { confirmationToken } = req.params;
    const { statusCode, body } =
      await AuthenticationController.confirmRegistration(confirmationToken);
    res.status(statusCode).send(body);
  }
);

export default router;
