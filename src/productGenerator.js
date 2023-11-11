// script para generar productos randomizados para testeo
import ProductManager from "./ProductManager.js"
import { PRODUCTS_PATH } from "./lib.js"

const pm = new ProductManager(PRODUCTS_PATH)

const AMT = 10

for (let i = 0; i < AMT; i++) {
  await pm.addProduct(
    `producto${i}`, //title
    "descripcion", // decription
    i * 5 + 1, // price
    "", // thumb
    `as3${i}`, // code
    255 // stock
  )
}
