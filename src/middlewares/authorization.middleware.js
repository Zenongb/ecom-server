import { ForbiddenError, AuthError } from "../errors/errors.js"
import { ROLE_VALUES } from "../config.js";
// middleware de autorización por privilegios
export const auth = role => {
  return (req,res,next) => {
    const user = req.user
    // check de super user
    if (user?.role === ROLE_VALUES._SUPER_USER) return next()
    if (role === ROLE_VALUES._AUTH_ONLY && req.isAuthenticated()) {
      // solo auth necesaria
      return next()
    } else if (user?.role === role) {
      // coinciden los privilegios
      return next()
    } else if (req.isAuthenticated()){
      // no coinciden y hay un usuario logueado
      next(new ForbiddenError("User is forbidden to enter this link"))
    } else {
      // no coinciden y no hay user logueado
      next(new AuthError("There is no user logged in"))
    }
  }
}
