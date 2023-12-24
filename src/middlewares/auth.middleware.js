import { createHash } from "node:crypto"
import session from "express-session"
import MongoStore from "connect-mongo"

import { AUTH_DB_URL, SESSION_SECRET } from "../config.js"

const store = connectMongo.create({
  mongoUrl: AUTH_DB_URL,
  ttl: 60 * 60 * 24, // 1d
});

// "Middleware" de setup de sessiones y store
export const sessions = session({
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

// middleware de autorización por privilegios
export const auth = role => {
  return (req,res,next) => {
    const user = req.session.user
    if (user?.role === role) {
      // coinciden los privilegios
      next()
    } else if (user?.isLoggedIn){
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
