// script para generar productos randomizados para testeo
import fs from "fs/promises"
import ProductManager from "../services/ProductManager.js"
import { PRODUCTS_PATH } from "./lib.js"

const AMT = 10

// check si el path existe

const pathArr = PRODUCTS_PATH.split("/")

// agarrar directorios, ya que el pm handlea el archivo inexistente. Tiene una
// inconsistencia con los paths relativos, ya que estos comienzan con "./", que
// en el split genera un primer item de la forma ".", por eso desestimar el 
// primer item. Esta funcionalidad deberia ser modificada
const dirs = pathArr.slice(1,-1)

// crear recursivamente los directorios
await fs.mkdir(dirs.join("/"), {recursive: true})

// una vez creados los directorios, proceder con la creacion de los productos

const pm = new ProductManager(PRODUCTS_PATH)


for (let i = 0; i < AMT; i++) {
  await pm.addProduct(
    `producto${i}`, //title
    "descripcion", // decription
    i * 5 + 1, // price
    "", // thumb
    `as3${i}`, // code
    i % 3 === 0? false : true, // status
    "cosa", // category
    255, // stock
  )
}
