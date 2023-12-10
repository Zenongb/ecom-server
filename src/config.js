
// variable del path de productos
export const PRODUCTS_PATH = "./data/products.json"; // cambiar a path absoluto
// variable de path de carrito
export const CARTS_PATH = "./data/carts.json"; // cambiar a path absolutoexport const PORT = 8080

export const PORT = 8080

// generacion de la database URI 
let userAuth
let dbUri
const database = "ecommerce"
// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.ECOM_DB_URI) {
  console.log("Recolectando variables de ambiente para conexion con la database")
  // agarramos el URI
  dbUri = process.env.ECOM_DB_URI
  // Procesamos user y pwd
  if (process.env.ECOM_DB_USER && process.env.ECOM_DB_PWD) {
    // se pasa username y pwd de la database
    console.log("Username y password reconocidos")
    userAuth = `${process.env.ECOM_DB_USER}:${process.env.ECOM_DB_PWD}@`
  } else {
    // no se pasa nada
    userAuth = ""
  }
} else {
  throw new Error("Missing URI for database connection")
}

// DATABASE URI
export const DB_URL = `mongodb+srv://${userAuth}${dbUri}/${database}?retryWrites=true&w=majority`