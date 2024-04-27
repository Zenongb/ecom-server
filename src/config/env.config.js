import logger from "../utils/logger.js"

export const MAILER_OPTS = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PWD,
  },
  secure: false
}


// generacion de la database URI 
let mainUser
let mainDbUri
const mainDatabase = "ecommerce"
// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.MAIN_DB_URI) {
  logger.log("info", "Recolectando variables de ambiente para conexion con la main database")
  // agarramos el URI
  mainDbUri = process.env.MAIN_DB_URI
  // Procesamos user y pwd
  if (process.env.MAIN_DB_USER && process.env.MAIN_DB_PWD) {
    // se pasa username y pwd de la database
    logger.log("info", "Username y password reconocidos")
    mainUser = `${process.env.MAIN_DB_USER}:${process.env.MAIN_DB_PWD}@`
  } else {
    // no se pasa nada
    mainUser = ""
  }
} else {
  throw new Error("Missing URI for database connection")
}
// MAIN DATABASE URI
export const MAIN_DB_URL = `mongodb+srv://${mainUser}${mainDbUri}/${mainDatabase}?retryWrites=true&w=majority`

// generacion de la auth database URI 
let authUser
let authDbUri
const authDatabase = "auth"
// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.AUTH_DB_URI) {
  logger.log("info", "Recolectando variables de ambiente para conexion con la database auth")
  // agarramos el URI
  authDbUri = process.env.AUTH_DB_URI
  // Procesamos user y pwd
  if (process.env.AUTH_DB_USER && process.env.AUTH_DB_PWD) {
    // se pasa username y pwd de la database
    logger.log("info", "Username y password reconocidos")
    authUser = `${process.env.AUTH_DB_USER}:${process.env.AUTH_DB_PWD}@`
  } else {
    // no se pasa nada
    authUser = ""
  }
} else {
  throw new Error("Missing URI for database connection")
}
// AUTH DATABASE URI
export const AUTH_DB_URL = `mongodb+srv://${authUser}${authDbUri}/${authDatabase}`

var ss
if (!process.env.SESSION_SECRET) {
  throw new Error("Missing session secret")
} else {
  ss = process.env.SESSION_SECRET
  logger.log("info", "gathered session secret")
}
export const SESSION_SECRET = ss


// GITHUB CLIENT AND SECRET
var ghCbUrl, ghClient, ghSecret
if (!process.env.GITHUB_CLIENT_SECRET || !process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CALLBACK_URL) {
  throw new Error("missing github config variables")
} else {
  ghCbUrl = process.env.GITHUB_CALLBACK_URL
  ghClient = process.env.GITHUB_CLIENT_ID
  ghSecret = process.env.GITHUB_CLIENT_SECRET
  logger.log("info", "gathered github id & secret")
}
export const GITHUB_CALLBACK_URL = ghCbUrl
export const GITHUB_CLIENT_ID = ghClient
export const GITHUB_CLIENT_SECRET = ghSecret
