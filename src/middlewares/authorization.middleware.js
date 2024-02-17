import { ROLE_VALUES } from "../config.js";
// middleware de autorización por privilegios
export const auth = role => {
  return (req,res,next) => {
    const user = req.user
    // check de super user
    if (user?.role === ROLE_VALUES._SUPER_USER) return next()
    if (role === ROLE_VALUES._AUTH_ONLY && req.isAuthenticated()) {
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
