"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileExtension = void 0;
const validateFileExtension = (req, res, next) => {
    const file = req.file;
    const extension = file.mimetype.split("/").pop();
    const allowedExtensions = ["jpg", "jpeg", "png"];
    if (!allowedExtensions.includes(extension)) {
        return res.status(400).json({
            message: "Invalid file format. Only JPG, JPEG and PNG files are allowed.",
        });
    }
    next();
};
exports.validateFileExtension = validateFileExtension;
