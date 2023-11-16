import express from "express"

// Routers import
import { apiRouter } from "./routers/api.router.js"


const PORT = 8080
const app = express()


// app middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// ROUTES
app.use("/api", apiRouter)

app.get("/", (_, res) => {
  console.log("request recieved")
  res.status(200).send("hola mundo")
})


app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))
