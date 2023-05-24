"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePictureFilterRequest = exports.validatePostId = exports.validateUploadPostPicture = exports.validateUpdatePostRequest = exports.validateAddPostRequest = void 0;
const express_validator_1 = require("express-validator");
const toolkit_1 = require("../../toolkit/");
const postsFieldsConstants_1 = require("../utils/postsFieldsConstants");
const regex_1 = require("../utils/regex");
exports.validateAddPostRequest = [
    (0, express_validator_1.body)("postDetails")
        .exists()
        .withMessage("Post details " + toolkit_1.CommonErrorCodes.REQUIRED),
    (0, express_validator_1.body)("postDetails.title")
        .exists()
        .withMessage("Title " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Title is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Title is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("postDetails.description")
        .exists()
        .withMessage("Description " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Description is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 300 })
        .withMessage("Description " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("postDetails.coordinates")
        .exists()
        .withMessage("Coordinates " + toolkit_1.CommonErrorCodes.REQUIRED),
    (0, express_validator_1.body)("postDetails.coordinates.latitude")
        .exists()
        .withMessage("Latitude " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isFloat()
        .withMessage("Latitude must be a numeric value!"),
    (0, express_validator_1.body)("postDetails.coordinates.longitude")
        .exists()
        .withMessage("Longitude " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isFloat()
        .withMessage("Longitude must be a numeric value!"),
    (0, express_validator_1.body)("postDetails.gender")
        .exists()
        .withMessage("Gender " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.genders)
        .withMessage("Gender is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.size")
        .exists()
        .withMessage("Size " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.sizes)
        .withMessage("Size is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.condition")
        .exists()
        .withMessage("Condition " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.conditions)
        .withMessage("Condition is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.style")
        .exists()
        .withMessage("Style " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.styles)
        .withMessage("Style is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.brand")
        .exists()
        .withMessage("Brand " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.brands)
        .withMessage("Brand is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.color")
        .exists()
        .withMessage("Color " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isIn(postsFieldsConstants_1.colors)
        .withMessage("Color is invalid!")
        .trim(),
    (0, express_validator_1.body)("postDetails.price")
        .exists()
        .withMessage("Price " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isInt({ min: 0 })
        .withMessage("Price must be a positive number!")
        .trim(),
    (0, express_validator_1.body)("postDetails.materials")
        .exists()
        .withMessage("Materials " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isArray({ min: 1 })
        .withMessage("Materials must be an array with at least one item!")
        .custom((value, { req }) => {
        for (let newMaterial of value) {
            if (!postsFieldsConstants_1.materials.includes(newMaterial)) {
                throw new Error(`${newMaterial} is not a valid material.`);
            }
        }
        return true;
    }),
    (0, express_validator_1.body)("iban")
        .optional()
        .matches(regex_1.regexIban)
        .withMessage("The IBAN doesn't respect the format of a valid IBAN!")
        .trim(),
    (0, express_validator_1.body)("address")
        .exists()
        .withMessage("Address " + toolkit_1.CommonErrorCodes.REQUIRED),
    (0, express_validator_1.body)("address.locality")
        .exists()
        .withMessage("Locality " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Locality is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Locality is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.city")
        .exists()
        .withMessage("City " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("City is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("City is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.street")
        .exists()
        .withMessage("Street " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isLength({ min: 3 })
        .withMessage("Street is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Street is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("address.number")
        .exists()
        .withMessage("Number " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isInt({ min: 0 })
        .withMessage("Number should be a positive number!")
        .trim(),
    (0, express_validator_1.body)("address.zipCode")
        .exists()
        .withMessage("Zipcode " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isInt({ min: 0 })
        .withMessage("Zipcode should be a positive number!")
        .trim(),
    toolkit_1.validationReporter,
];
exports.validateUpdatePostRequest = [
    (0, express_validator_1.param)("postId")
        .exists()
        .withMessage("Post id " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isMongoId()
        .withMessage("Invalid post id!")
        .trim(),
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Title is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 100 })
        .withMessage("Title is " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Description is " + toolkit_1.CommonErrorCodes.TOO_SHORT + ".")
        .isLength({ max: 300 })
        .withMessage("Description " + toolkit_1.CommonErrorCodes.TOO_LONG)
        .trim(),
    (0, express_validator_1.body)("gender")
        .optional()
        .isIn(postsFieldsConstants_1.genders)
        .withMessage("Gender is invalid!")
        .trim(),
    (0, express_validator_1.body)("size").optional().isIn(postsFieldsConstants_1.sizes).withMessage("Size is invalid!").trim(),
    (0, express_validator_1.body)("condition")
        .optional()
        .isIn(postsFieldsConstants_1.conditions)
        .withMessage("Condition is invalid!")
        .trim(),
    (0, express_validator_1.body)("style").optional().isIn(postsFieldsConstants_1.styles).withMessage("Style is invalid!").trim(),
    (0, express_validator_1.body)("brand").optional().isIn(postsFieldsConstants_1.brands).withMessage("Brand is invalid!").trim(),
    (0, express_validator_1.body)("color").optional().isIn(postsFieldsConstants_1.colors).withMessage("Color is invalid!").trim(),
    (0, express_validator_1.body)("price")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Price must be a positive number!")
        .trim(),
    (0, express_validator_1.body)("materials")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Materials must be an array with at least one item!")
        .custom((value, { req }) => {
        for (let newMaterial of value) {
            if (!postsFieldsConstants_1.materials.includes(newMaterial)) {
                throw new Error(`${newMaterial} is not a valid material.`);
            }
        }
        return true;
    }),
    toolkit_1.validationReporter,
];
exports.validateUploadPostPicture = [
    (0, express_validator_1.param)("postId")
        .exists()
        .withMessage("Post id " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isMongoId()
        .withMessage("Invalid post id!")
        .trim(),
    (0, express_validator_1.check)("picture")
        .exists()
        .withMessage("Picture " + toolkit_1.CommonErrorCodes.REQUIRED)
        .custom((value, { req }) => {
        if (!req.files || !req.files.file) {
            return true;
        }
        const file = req.files.file;
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error("Invalid file format. Only JPG, JPEG, and PNG files are allowed.");
        }
        return true;
    }),
    toolkit_1.validationReporter,
];
exports.validatePostId = [
    (0, express_validator_1.param)("postId")
        .exists()
        .withMessage("Post id " + toolkit_1.CommonErrorCodes.REQUIRED)
        .isMongoId()
        .withMessage("Invalid post id!")
        .trim(),
    toolkit_1.validationReporter,
];
exports.validatePictureFilterRequest = [
    (0, express_validator_1.body)("picture")
        .exists()
        .withMessage("Picture " + toolkit_1.CommonErrorCodes.REQUIRED)
        .custom((value, { req }) => {
        if (!req.files || !req.files.file) {
            return true;
        }
        const file = req.files.file;
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error("Invalid file format. Only JPG, JPEG, and PNG files are allowed.");
        }
        return true;
    }),
    toolkit_1.validationReporter,
];
