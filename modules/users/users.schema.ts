import mongoose from "mongoose";
import { IUserModel, Address, UserRoles, AccountStatus } from "./users.models";
import geocoder from "../utils/geocoder";
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

// UserDataSchema.pre("save", async function (next) {
//   const existingAddress = this.address;
//   console.log(this.address);
//   if (existingAddress && JSON.stringify(existingAddress) !== "{}") {
//     const addressString = `${existingAddress.number}, ${existingAddress.street}, ${existingAddress.city}, ${existingAddress.locality}`;

//     const location = await geocoder.geocode({
//       address: addressString,
//       country: "Romania",
//     });

//     console.log(location);
//     this.address = {
//       ...existingAddress,
//       coordinates: [location[0].longitude || 0, location[0].latitude || 0],
//       formattedAddress: location[0].formattedAddress,
//     };
//   }
//   next();
// });

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
