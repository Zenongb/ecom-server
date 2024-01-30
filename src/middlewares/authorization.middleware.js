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
      const errUnauthorized = new Error("User is forbidden to enter this link")
      errUnauthorized.code = "EFORBIDDEN"
      next(errUnauthorized)
    } else {
      // no coinciden y no hay user logueado
      const errNotLoggedIn = new Error("There is no user logged in")
      errNotLoggedIn.code = "ENOAUTH"
      next(errNotLoggedIn)
    }
  }
}
