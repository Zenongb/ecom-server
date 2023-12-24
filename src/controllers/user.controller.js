import { ADMIN_USER_MAIL } from "../config.js";
import userManager from "../database/models/user.model.js";
import { hashPwd } from "../utils/lib.js";

export const register = async (req, res) => {
  const userInfo = req.body;
  try {
    // hasheamos pwd
    userInfo.password = hashPwd(userInfo.password);
    if (userInfo.email === ADMIN_USER_MAIL || userInfo.email === "zeta@mail.com") {
      userInfo.role = "admin";
    }
    const createResult = await userManager.create(userInfo);
    console.log(createResult);
    return res.status(201).json({
      status: "success",
      payload: createResult,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  const userInfo = req.body;
  try {
    // hasheamos pwd
    userInfo.password = hashPwd(userInfo.password);
    console.log("userInfo")
    console.log(userInfo)
    let user = await userManager.findOne({ email: userInfo.email });
    console.log("user")
    console.log(user)
    if (!user) {
      throw new Error("WRONGEMAIL");
    }
    if (user.password !== userInfo.password) {
      throw new Error("WRONGPWD");
    }
    user.loginHist.push(Date.now());
    await user.save()
    user = user.toObject()
    console.log("user is",user);
    if (req.session) {
      console.log("session is", res.session)
    }
    req.session["user"] = {
      mail: user.email,
      role: user.role
    }
    return res.status(201).json({
      status: "success",
      payload: user,
    });
  } catch (err) {
    console.log(err);
    if (err.message === "WRONGPWD") {
      return res.status(400).json({
        status: "error",
        message: "Wrong password",
      });
    } else if (err.message === "WRONGEMAIL") {
      return res.status(404).json({
        status: "error",
        message: "No user with that email",
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
