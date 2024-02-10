import {userService} from "../services/index.service.js";

export const register = async (req, res, next) => {
  const userInfo = req.body;
  try {
    const registerResult = await userService.registerUser(userInfo);
    return res.status(201).json({
      status: "success",
      payload: registerResult,
    });
  } catch (err) {
    next(err)
  }
};

// DEPRECADO
export const login = async (req, res, next) => {
  const userInfo = req.body;
  try {
    // logueamos al usuario
    const user = await userService.loginUser(userInfo);
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
    next(err)
  }
};
