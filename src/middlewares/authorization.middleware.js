import { AUTH_ONLY_TAG } from "../config.js";
// middleware de autorización por privilegios
export const auth = role => {
  return (req,res,next) => {
    const user = req.user
    console.log("in auth middle", user)
    if (role === AUTH_ONLY_TAG && req.isAuthenticated()) {
      // solo auth necesaria
      next()
    } else if (user?.role === role) {
      // coinciden los privilegios
      next()
    } else if (req.isAuthenticated()){
      // no coinciden y hay un usuario logueado
      return res.status(403).json({
        status: "error",
        message: "user forbidden to enter this page"
      })
    } else {
      // no coinciden y no hay user logueado
      return res.status(401).json({
        status: "unauthorized",
        message: "log in first"
      })
    }
  }
}
