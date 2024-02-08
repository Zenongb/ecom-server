import { randomUUID } from "node:crypto";
import mongoose from "mongoose";

import { ADMIN_USER } from "../../config.js";
import { hashPwd, comparePwd } from "../../utils/hash.js"


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
    statics: {
      registerUser,
      loginUser,
    }
  }
);

async function registerUser(user) {
  try {
    // hasheamos pwd
    if (user.email === ADMIN_USER.mail && user.password === ADMIN_USER.pwd) {
      user.role = "admin";
    }
    if (user.password) user.password = await hashPwd(user.password);
    let createResult = await this.create(user);
    console.log("in registerUser", createResult);
    createResult = createResult.toObject()
    delete user.password
    return createResult
  } catch (err) {
    // TODO: hacer prolijo
    throw new Error(err.message)
  }
}

async function loginUser(loginData) {
  try {
    // hasheamos pwd
    let user = await this.findOne({ email: loginData.email });
    console.log("user")
    console.log(user)
    if (!user) {
      const errNotFound = new Error("User not found!");
      errNotFound.code = "ENOENT"
      throw errNotFound
    }
    // checkear si existe password
    if (user.password) {
      if (!await comparePwd(loginData.password, user.password)) {
        const errWrongPwd = new Error("Wrong email or password");
        errWrongPwd.code = "EBADREQ"
        throw errWrongPwd
      }
    }
    user.loginHist.push(Date.now());
    await user.save()
    user = user.toObject()
    delete user.password
    return user
  } catch (err) {
    // TODO: hacer prolijo
    throw err
  }
}

const UserManager = mongoose.model(userCollection, userSchema)
export default UserManager
