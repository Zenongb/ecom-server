import { Router } from "express"
import ProductManager from "./src/ProductManager.js"

import { PRODUCTS_PATH } from "./src/utils/lib.js"


const pm = new ProductManager(PRODUCTS_PATH)

export const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
  let limit = req.query.limit
  limit = Number(limit)
  try {
    let products = await pm.getProducts()
    // limit int check, if true, then slice
    products = !isNaN(limit)? products.slice(0, limit): products
    return res.status(200).json(products)
  } catch (err) {
    console.log(err)
    res.status(500).send("Error al buscar los productos")
  }
})

productsRouter.get("/:pid", async (req, res) => {
  let pid = req.params.pid
  try {
    const product = await pm.getProductById(pid)
    res.status(200).json({
      status: "Success",
      payload: product,
    })
  } catch (err) {
    console.log(err)
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "Failed",
        message: "Not Found"
      })
    }
    // generic error response
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    })
  }
})
