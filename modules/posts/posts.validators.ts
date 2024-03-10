import { body, check, param, query } from "express-validator";
import { validationReporter, CommonErrorCodes } from "../../toolkit/";
import {
  brands,
  colors,
  conditions,
  genders,
  materials,
  sizes,
  styles,
} from "../utils/postsFieldsConstants";
import { regexIban } from "../utils/regex";

export const validateAddPostRequest = [
  body("postDetails")
    .exists()
    .withMessage("Post details " + CommonErrorCodes.REQUIRED),
  body("postDetails.title")
    .exists()
    .withMessage("Title " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Title is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Title is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("postDetails.description")
    .exists()
    .withMessage("Description " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Description is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 300 })
    .withMessage("Description " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("postDetails.coordinates")
    .exists()
    .withMessage("Coordinates " + CommonErrorCodes.REQUIRED),
  body("postDetails.coordinates.latitude")
    .exists()
    .withMessage("Latitude " + CommonErrorCodes.REQUIRED)
    .isFloat()
    .withMessage("Latitude must be a numeric value!"),
  body("postDetails.coordinates.longitude")
    .exists()
    .withMessage("Longitude " + CommonErrorCodes.REQUIRED)
    .isFloat()
    .withMessage("Longitude must be a numeric value!"),
  body("postDetails.gender")
    .exists()
    .withMessage("Gender " + CommonErrorCodes.REQUIRED)
    .isIn(genders)
    .withMessage("Gender is invalid!")
    .trim(),
  body("postDetails.size")
    .exists()
    .withMessage("Size " + CommonErrorCodes.REQUIRED)
    .isIn(sizes)
    .withMessage("Size is invalid!")
    .trim(),
  body("postDetails.condition")
    .exists()
    .withMessage("Condition " + CommonErrorCodes.REQUIRED)
    .isIn(conditions)
    .withMessage("Condition is invalid!")
    .trim(),
  body("postDetails.style")
    .exists()
    .withMessage("Style " + CommonErrorCodes.REQUIRED)
    .isIn(styles)
    .withMessage("Style is invalid!")
    .trim(),
  body("postDetails.brand")
    .exists()
    .withMessage("Brand " + CommonErrorCodes.REQUIRED)
    .isIn(brands)
    .withMessage("Brand is invalid!")
    .trim(),
  body("postDetails.color")
    .exists()
    .withMessage("Color " + CommonErrorCodes.REQUIRED)
    .isIn(colors)
    .withMessage("Color is invalid!")
    .trim(),
  body("postDetails.price")
    .exists()
    .withMessage("Price " + CommonErrorCodes.REQUIRED)
    .isInt({ min: 0 })
    .withMessage("Price must be a positive number!")
    .trim(),
  body("postDetails.materials")
    .exists()
    .withMessage("Materials " + CommonErrorCodes.REQUIRED)
    .isArray({ min: 1 })
    .withMessage("Materials must be an array with at least one item!")
    .custom((value, { req }) => {
      // Loop through each new material in the array
      for (let newMaterial of value) {
        if (!materials.includes(newMaterial)) {
          throw new Error(`${newMaterial} is not a valid material.`);
        }
      }

      // All new materials are valid
      return true;
    }),
  //validate iban
  body("iban")
    .optional()
    .matches(regexIban)
    .withMessage("The IBAN doesn't respect the format of a valid IBAN!")
    .trim(),
  body("address")
    .exists()
    .withMessage("Address " + CommonErrorCodes.REQUIRED),
  body("address.locality")
    .exists()
    .withMessage("Locality " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Locality is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Locality is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.city")
    .exists()
    .withMessage("City " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("City is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("City is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.street")
    .exists()
    .withMessage("Street " + CommonErrorCodes.REQUIRED)
    .isLength({ min: 3 })
    .withMessage("Street is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Street is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("address.number")
    .exists()
    .withMessage("Number " + CommonErrorCodes.REQUIRED)
    .isInt({ min: 0 })
    .withMessage("Number should be a positive number!")
    .trim(),
  body("address.zipCode")
    .exists()
    .withMessage("Zipcode " + CommonErrorCodes.REQUIRED)
    .isInt({ min: 0 })
    .withMessage("Zipcode should be a positive number!")
    .trim(),

  validationReporter,
];

export const validateUpdatePostRequest = [
  param("postId")
    .exists()
    .withMessage("Post id " + CommonErrorCodes.REQUIRED)
    .isMongoId()
    .withMessage("Invalid post id!")
    .trim(),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 100 })
    .withMessage("Title is " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("description")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Description is " + CommonErrorCodes.TOO_SHORT + ".")
    .isLength({ max: 300 })
    .withMessage("Description " + CommonErrorCodes.TOO_LONG)
    .trim(),
  body("gender")
    .optional()
    .isIn(genders)
    .withMessage("Gender is invalid!")
    .trim(),
  body("size").optional().isIn(sizes).withMessage("Size is invalid!").trim(),
  body("condition")
    .optional()
    .isIn(conditions)
    .withMessage("Condition is invalid!")
    .trim(),
  body("style").optional().isIn(styles).withMessage("Style is invalid!").trim(),
  body("brand").optional().isIn(brands).withMessage("Brand is invalid!").trim(),
  body("color").optional().isIn(colors).withMessage("Color is invalid!").trim(),
  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Price must be a positive number!")
    .trim(),
  body("materials")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Materials must be an array with at least one item!")
    .custom((value, { req }) => {
      // Loop through each new material in the array
      for (let newMaterial of value) {
        if (!materials.includes(newMaterial)) {
          throw new Error(`${newMaterial} is not a valid material.`);
        }
      }

      // All new materials are valid
      return true;
    }),
  //validate Category
  validationReporter,
];

export const validateUploadPostPicture = [
  param("postId")
    .exists()
    .withMessage("Post id " + CommonErrorCodes.REQUIRED)
    .isMongoId()
    .withMessage("Invalid post id!")
    .trim(),
  check("picture")
    .exists()
    .withMessage("Picture " + CommonErrorCodes.REQUIRED)
    .custom((value, { req }) => {
      if (!req.files || !req.files.file) {
        // File not provided, so it passes validation
        return true;
      }

      const file = req.files.file;
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(
          "Invalid file format. Only JPG, JPEG, and PNG files are allowed."
        );
      }

      return true;
    }),
  validationReporter,
];

export const validatePostId = [
  param("postId")
    .exists()
    .withMessage("Post id " + CommonErrorCodes.REQUIRED)
    .isMongoId()
    .withMessage("Invalid post id!")
    .trim(),

  validationReporter,
];

export const validatePictureFilterRequest = [
  body("picture")
    .exists()
    .withMessage("Picture " + CommonErrorCodes.REQUIRED)
    .custom((value, { req }) => {
      if (!req.files || !req.files.file) {
        // File not provided, so it passes validation
        return true;
      }

      const file = req.files.file;
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(
          "Invalid file format. Only JPG, JPEG, and PNG files are allowed."
        );
      }

      return true;
    }),
  validationReporter,
];
