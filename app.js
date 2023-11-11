import express from "express"
import ProductManager from "./src/ProductManager.js"
import { PRODUCTS_PATH } from "./src/lib.js"


const PORT = 8080
const app = express()

const pm = new ProductManager(PRODUCTS_PATH)

// app middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get("/", (_, res) => {
  console.log("request recieved")
  res.status(200).send("hola mundo")
})

app.get("/products", async (req, res) => {
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

app.get("/products/:id", async (req, res) => {
  let pid = req.params.id
  try {
    const product = await pm.getProductById(pid)
    res.status(200).json(product)
  } catch (err) {
    console.log(err)
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        message: "Not Found",
        code: "ENOENT"
      })
    }
    // generic error response
    return res.status(500).json({
      message: "Error al buscar producto",
    })
  }
})

app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))
