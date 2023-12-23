
// variable del path de productos
export const PRODUCTS_PATH = "./data/products.json"; // cambiar a path absoluto
// variable de path de carrito
export const CARTS_PATH = "./data/carts.json"; // cambiar a path absolutoexport const PORT = 8080

// Variable de cantidad de productos por pagina
export const PRODUCTS_PER_PAGE = 10

export const PORT = 8080

// generacion de la database URI 
let mainUser
let mainDbUri
const mainDatabase = "ecommerce"
// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.MAIN_DB_URI) {
  console.log("Recolectando variables de ambiente para conexion con la main database")
  // agarramos el URI
  mainDbUri = process.env.MAIN_DB_URI
  // Procesamos user y pwd
  if (process.env.MAIN_DB_USER && process.env.MAIN_DB_PWD) {
    // se pasa username y pwd de la database
    console.log("Username y password reconocidos")
    mainUser = `${process.env.MAIN_DB_USER}:${process.env.MAIN_DB_PWD}@`
  } else {
    // no se pasa nada
    mainUser = ""
  }
} else {
  throw new Error("Missing URI for database connection")
}
// DATABASE URI
export const MAIN_DB_URL = `mongodb+srv://${mainUser}${mainDbUri}/${mainDatabase}?retryWrites=true&w=majority`

// generacion de la auth database URI 
let authUser
let authDbUri
const authDatabase = "auth"
// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.AUTH_DB_URI) {
  console.log("Recolectando variables de ambiente para conexion con la database auth")
  // agarramos el URI
  dbUri = process.env.AUTH_DB_URI
  // Procesamos user y pwd
  if (process.env.AUTH_DB_USER && process.env.AUTH_DB_PWD) {
    // se pasa username y pwd de la database
    console.log("Username y password reconocidos")
    authUser = `${process.env.AUTH_DB_USER}:${process.env.AUTH_DB_PWD}@`
  } else {
    // no se pasa nada
    authUser = ""
  }
} else {
  throw new Error("Missing URI for database connection")
}

// DATABASE URI
export const DB_URL = `mongodb+srv://${authUser}${authDbUri}/${authDatabase}?retryWrites=true&w=majority`