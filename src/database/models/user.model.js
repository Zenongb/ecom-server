import { randomUUID } from "node:crypto";
import mongoose from "mongoose";

const userCollection = "users"
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    loginHist: [
      {
        type: Date,
        default: new Date(),
      },
    ],
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

const userManager = mongoose.model(userCollection, userSchema)
export default userManager