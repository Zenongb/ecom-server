import session from "express-session"
import MongoStore from "connect-mongo"

import { AUTH_DB_URL, SESSION_SECRET } from "../config.js"

// KNOWN ERROR: connect-mongo genera un error con el gracefull shutdown 
// y la funcionalidad de nodemon
// DESCRIPCION: Cuando nodemon reinicia el servidor sea por cambios en archivos 
// o manual restart se ejecuta dos veces el gracefull shutdown del servidor 
// y no se vuelve a levantar.
const store = MongoStore.create({
  mongoUrl: AUTH_DB_URL,
  ttl: 60 * 60 * 24, // 1d
});

// "Middleware" de setup de sessiones y store
export const sessionHandler = session({
  store: store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 2 * 1000
  }
});

// middleware de autorización por privilegios
export const auth = role => {
  return (req,res,next) => {
    const user = req.session.user
    console.log("in auth middle", user)
    if (user?.role === role) {
      // coinciden los privilegios
      next()
    } else if (user?.mail){
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
