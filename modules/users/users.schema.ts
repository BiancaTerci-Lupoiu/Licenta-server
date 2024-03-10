import mongoose from "mongoose";
import { IUserModel, Address, UserRoles, AccountStatus } from "./users.models";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const UserDataSchema = new Schema<IUserModel>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: String,
  role: { type: String, enum: UserRoles, default: UserRoles.USER },
  address: {
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    locality: String,
    city: String,
    street: String,
    number: Number,
    zipCode: Number,
  },
  iban: String,
  picture: String,
  status: { type: String, enum: AccountStatus, default: AccountStatus.PENDING },
  confirmationToken: { type: String, default: "" },
});

UserDataSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

export const UserData = mongoose.model("User", UserDataSchema, "users");
