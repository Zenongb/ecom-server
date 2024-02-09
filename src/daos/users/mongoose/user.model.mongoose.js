import mongoose from "mongoose";

const userCollection = "users"
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID(),
    },
    first_name: {
      type: String,
    }, 
    last_name: {
      type: String,
    }, 
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age : {
      type: Number
    },
    password: {
      type: String,
    },
    cart: {
      type: String,
      ref: "carts"
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


const UserModel = mongoose.model(userCollection, userSchema)
export default UserModel
