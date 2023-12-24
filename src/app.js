import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"

import mongoose from "mongoose"

import { MAIN_DB_URL, PORT } from "./config.js"

// session handler import
import { sessionHandler } from "./middlewares/auth.middleware.js"

// Routers import
import { webRouter } from "./routers/web.router.js"
import { apiRouter } from "./routers/api.router.js"
// Sockets import
import { connectionSocket } from "./controllers/products.controller.js"


const app = express()
try {
  await mongoose.connect(MAIN_DB_URL)
} catch (err) {
  throw new Error("Error al conectarse con la main DB", { cause: err })
}

// handlebars engine
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")

// standard app middleware
app.use(express.urlencoded({extended: true}))
// le cambio el campo strict al middle de json para poder paersear los
// integers recibidos para el update de products
app.use(express.json({strict: false})) 

// aniadimos el session handler
app.use(sessionHandler)

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

// pro un error indefinido con la store de connect mongo, voy a deprecar temporal
// mente el gracefull shutdown
// Realizamos un graceful shutdown del sistema
// process.on('SIGUSR2', () => {
//   console.log('Cerrando Servidor.')
  // cerramos la conexion a la db
//   mongoose.connection.close()
  // cerramos el servidor
//   httpServer.close(() => {
//     console.log('HTTP server closed')
//   })
// })
