import express from "express"
import ProductManager from "./src/ProductManager.js"

const PORT = 8080

const pm = new ProductManager("data/products.json")
const app = express()

app.use(express.json)

app.get("", (req, res) => {
  res.send("hello world")
})

app.get("/products", (req, res) => {
  const limit = req.params.limit
  const products = pm.getProducts()
  return res.status(200).json(products)
})

app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))
