import express, { Request, Response } from "express";
import Modules from "./modules";
import mongoose from "mongoose";
import { config } from "./config";
import cors from "cors";

const app = express();

//allow cors
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] })
);

mongoose.set("strictQuery", true);

mongoose
  .connect(config.connectionString)
  .then(() => console.log("Connected to database!"))
  .catch(() => {
    console.log("Failed to connect to database!");
  });

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/", Modules);

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy");
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

import { getModules, getModulesDependencies } from "tsviz";

const tsConfigDir = "./tsconfig.json";

const modules = getModules(tsConfigDir);

const modulesDependencies = getModulesDependencies(tsConfigDir);
