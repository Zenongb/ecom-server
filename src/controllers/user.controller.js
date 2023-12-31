import userManager from "../database/models/user.model.js";

export const register = async (req, res) => {
  const userInfo = req.body;
  try {
    const registerResult = await userManager.registerUser(userInfo);
    return res.status(201).json({
      status: "success",
      payload: registerResult,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// DEPRECADO
export const login = async (req, res) => {
  const userInfo = req.body;
  try {
    // logueamos al usuario
    const user = await userManager.loginUser(userInfo);
    // activamos la sesion del usuario
    req.login(
      {
        mail: user.email,
        role: user.role,
      },
      // error callback
      err => {
        if (err) {
          throw new Error("passport error", { cause: err });
        }
      }
    );
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
