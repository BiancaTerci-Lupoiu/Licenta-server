import { body, check, param } from "express-validator";
import { validationReporter, CommonErrorCodes } from "../../toolkit/";
import { regexIban, regexPhoneNumber } from "../utils/regex";

export const validateUpdateUserRequest = [
  param("userId")
    .exists()
    .withMessage("User id " + CommonErrorCodes.REQUIRED)
    .isMongoId()
    .withMessage("Invalid user id ")
    .trim(),
  body("firstName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("First name is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 30 })
    .withMessage("First name is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("lastName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Last name is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 30 })
    .withMessage("Last name is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("phoneNumber")
    .optional()
    .matches(regexPhoneNumber)
    .withMessage("The phone number is invalid! It should have only 10 digits!")
    .trim(),
  body("iban")
    .optional()
    .matches(regexIban)
    .withMessage("The IBAN doesn't respect the format of a valid IBAN!")
    .trim(),
  body("address").optional(),
  body("address.locality")
    .if(body("address").exists())
    .exists()
    .withMessage("Locality " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Locality is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Locality is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.city")
    .if(body("address").exists())
    .exists()
    .withMessage("City " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("City is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("City is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.street")
    .if(body("address").exists())
    .exists()
    .withMessage("Street " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Street is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Street is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.number")
    .if(body("address").exists())
    .exists()
    .withMessage("Number " + CommonErrorCodes.REQUIRED)
    .isInt({ min: 0 })
    .withMessage("Number should be a positive number!")
    .trim(),
  body("address.zipCode")
    .if(body("address").exists())
    .exists()
    .withMessage("Zipcode " + CommonErrorCodes.REQUIRED)
    .isInt({ min: 0 })
    .withMessage("Zipcode should be a positive number!")
    .trim(),

  validationReporter,
];

export const validateUserId = [
  param("userId")
    .exists()
    .withMessage("User id " + CommonErrorCodes.REQUIRED)
    .isMongoId()
    .withMessage("Invalid user id ")
    .trim(),

  validationReporter,
];
