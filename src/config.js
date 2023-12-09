
// variable del path de productos
export const PRODUCTS_PATH = "./data/products.json"; // cambiar a path absoluto
// variable de path de carrito
export const CARTS_PATH = "./data/carts.json"; // cambiar a path absolutoexport const PORT = 8080

export const PORT = 8080

// generacion de la database URI 
let dbUri 
let dbUser 
let dbPwd 
const database = "ecommerce"

// check si exiten variables de amibente para vincular la db y protejer 
// secretos como user y pwd
if (process.env.ECOM_DB_URI && process.env.ECOM_DB_USER && process.env.ECOM_DB_PWD) {
  dbUri = process.env.ECOM_DB_URI
  dbUser = process.env.ECOM_DB_USER
  dbPwd = process.env.ECOM_DB_PWD
} else {
  throw new Error("Missing environment variables for database connection")
}

// DATABASE URI
export const DB_URL = `mongodb+srv://${dbUser}:${dbPwd}@${dbUri}/${database}?retryWrites=true&w=majority`