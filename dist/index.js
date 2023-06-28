"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = __importDefault(require("./modules"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }));
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(config_1.config.connectionString)
    .then(() => console.log("Connected to database!"))
    .catch(() => console.log("Failed to connect to database!"));
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/", modules_1.default);
app.get("/health", (_req, res) => {
    res.send("Healthy");
});
app.listen(config_1.config.port, () => {
    console.log(`Server listening on port ${config_1.config.port}`);
});
const tsviz_1 = require("tsviz");
const tsConfigDir = "./tsconfig.json";
const modules = (0, tsviz_1.getModules)(tsConfigDir);
const modulesDependencies = (0, tsviz_1.getModulesDependencies)(tsConfigDir);
