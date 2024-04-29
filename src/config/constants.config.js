export const MODE = "online"
export const ENV = process.env.NODE_ENV || "development"
export const ROLE_VALUES = {
  _AUTH_ONLY: "auth",
  _SUPER_USER: "super",
  _ADMIN: "admin",
  _PREMIUM: "premium",
  _USER: "user",
}
// variable del path de productos
export const PRODUCTS_PATH = "./data/products.json"; // cambiar a path absoluto
// variable de path de carrito
export const CARTS_PATH = "./data/carts.json"; // cambiar a path absoluto
// Variable de cantidad de productos por pagina
export const PRODUCTS_PER_PAGE = 10
export const PORT = 8080
// admin email
export const ADMIN_USER = {
  mail: "adminCoder@coder.com",
  pwd: "adminCod3r123"
}

