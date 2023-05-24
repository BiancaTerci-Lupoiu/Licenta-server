"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = exports.validateUpdateUserRequest = void 0;
const express_validator_1 = require("express-validator");
const toolkit_1 = require("../../toolkit/");
const regex_1 = require("../utils/regex");
exports.validateUpdateUserRequest = [
    (0, express_validator_1.param)("userId")
        .exists()
        .withMessage("User id " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isMongoId()
        .withMessage("Invalid user id ")
        .trim(),
    (0, express_validator_1.body)("firstName")
        .optional()
        .isLength({ min: 3 })
        .withMessage("First name is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 30 })
        .withMessage("First name is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("lastName")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Last name is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 30 })
        .withMessage("Last name is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .matches(regex_1.regexPhoneNumber)
        .withMessage("The phone number is invalid! It should have only 10 digits!")
        .trim(),
    (0, express_validator_1.body)("iban")
        .optional()
        .matches(regex_1.regexIban)
        .withMessage("The IBAN doesn't respect the format of a valid IBAN!")
        .trim(),
    (0, express_validator_1.body)("address").optional(),
    (0, express_validator_1.body)("address.locality")
        .if((0, express_validator_1.body)("address").exists())
        .exists()
        .withMessage("Locality " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Locality is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Locality is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.city")
        .if((0, express_validator_1.body)("address").exists())
        .exists()
        .withMessage("City " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("City is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("City is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.street")
        .if((0, express_validator_1.body)("address").exists())
        .exists()
        .withMessage("Street " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Street is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Street is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.number")
        .if((0, express_validator_1.body)("address").exists())
        .exists()
        .withMessage("Number " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isInt({ min: 0 })
        .withMessage("Number should be a positive number!")
        .trim(),
    (0, express_validator_1.body)("address.zipCode")
        .if((0, express_validator_1.body)("address").exists())
        .exists()
        .withMessage("Zipcode " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isInt({ min: 0 })
        .withMessage("Zipcode should be a positive number!")
        .trim(),
    toolkit_1.validationReporter,
];
exports.validateUserId = [
    (0, express_validator_1.param)("userId")
        .exists()
        .withMessage("User id " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isMongoId()
        .withMessage("Invalid user id ")
        .trim(),
    toolkit_1.validationReporter,
];
