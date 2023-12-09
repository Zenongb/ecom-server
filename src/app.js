import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"

import mongoose from "mongoose"

import { DB_URL, PORT } from "./config.js"

// Routers import
import { webRouter } from "./routers/web.router.js"
import { apiRouter } from "./routers/api.router.js"
// Sockets import
import { connectionSocket } from "./controllers/products.controller.js"


const app = express()
mongoose.connect(DB_URL)

// handlebars engine
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")

// standard app middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// instanciar el servidor http
const httpServer = app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`)
})

// instanciar websockets server
export const wsServer = new Server(httpServer)

// conectar sockets
wsServer.on("connect", connectionSocket)

// static routes
app.use(express.static('./public'))
app.use(express.static('./views'))
app.use("/static", express.static("./static"))

// ROUTES
app.use("/api", apiRouter)

app.use("/", webRouter)

// Realizamos un graceful shutdown del sistema
process.on('SIGTERM', () => {
  console.log('Cerrando Servidor.')
  // cerramos la conexion a la db
  mongoose.connection.close()
  // cerramos el servidor
  httpServer.close(() => {
    console.log('HTTP server closed')
  })
})
