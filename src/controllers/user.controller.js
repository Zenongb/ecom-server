import {userService} from "../services/index.service.js";

export const registerController = async (req, res, next) => {
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

export const updateUserController = async (req, res, next) => {
  const uid = req.params.uid
  const updateData = req.body
  logger.log("debug", "updateData in controller is", updateData)
  try {
    const updUser = await userService.update(uid, updateData)
    logger.log("debug", "in controller, updateRes", updUser)
    req.login(updUser,(err) => {
      if (err) { return next(err); }
    })
    res.status(200).json({
      status: "success",
      payload: updUser
    })
  } catch (err) {
    next(err)
  }
}

export const getCurrentUserController = async (req, res, next) => {
  try {
    const userData = await userService.getUser(req.user.id)
    res.status(200).json({
      status: "success",
      payload: userData
    })
  } catch (err) {
    next(err)
  }
}

export const getUsersController = async (req, res, next) => {
  try {
    const userData = await userService.getUsers({})
    res.status(200).json({
      status: "success",
      payload: userData
    })
  } catch (err) {
    next(err)
  }
}

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

