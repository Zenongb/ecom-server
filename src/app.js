import express from "express"
import ProductManager from "./src/ProductManager.js"
import { PRODUCTS_PATH } from "./src/utils/lib.js"


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


app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))
