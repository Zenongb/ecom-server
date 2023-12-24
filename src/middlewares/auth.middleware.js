import { createHash } from "node:crypto"
import session from "express-session"
import MongoStore from "connect-mongo"

import { AUTH_DB_URL, SESSION_SECRET } from "../config.js"

const store = MongoStore.create({
  mongoUrl: AUTH_DB_URL
})

export const sessionHandler = session({
  store,
  secret: SESSION_SECRET,
  ttl: 60 * 60 * 6
})
