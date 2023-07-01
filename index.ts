import express, { Request, Response } from "express";
import Modules from "./modules";
import dotenv from "dotenv";
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
  .connect(
    "mongodb+srv://user:user@cluster0.iwn9z9v.mongodb.net/secondLife?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to database!"))
  .catch(() =>
    console.log("Failed to connect to database!", config.connectionString)
  );

app.use(express.static("public"));

//app.use(express.raw({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/", Modules);

// app.use((_req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

app.get("/health", (_req: Request, res: Response) => {
  res.send("Healthy");
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

//app.options("*", cors());

import { getModules, getModulesDependencies } from "tsviz";

const tsConfigDir = "./tsconfig.json";

const modules = getModules(tsConfigDir);

const modulesDependencies = getModulesDependencies(tsConfigDir);
