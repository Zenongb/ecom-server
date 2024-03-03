import { Server } from "socket.io"

import { app } from './app/app.js'
import { closeDb, connectDb } from "./database/mongodb.database.js"
import { initClient } from "./sockets/index.socket.js"
import logger from "./utils/logger.js"

import { PORT } from "./config/constants.config.js"

await connectDb()

// instanciar el servidor http
const httpServer = app.listen(PORT, () => {
  logger.log("info", `listening on localhost:${PORT}`)
})

// instanciar websockets server
export const wsServer = new Server(httpServer)
// conectar sockets
wsServer.on("connect", initClient)

// implementacion del unhandled error logger

process.on("uncaughtException", (err) => {
  logger.log("fatal", {
    message:  `Uncaught error with message: ${err.message} & code: ${err.code || "[no code]"}`,
    stack: err.stack
  })
})

// pro un error indefinido con la store de connect mongo, voy a deprecar temporal
// mente el graceful shutdown
// Realizamos un graceful shutdown del sistema
// process.on('SIGTERM', () => {
//   console.log('Cerrando Servidor.')
//   // cerramos la conexion a la db
//   closeDb()
//   // cerramos el servidor
//   httpServer.close(() => {
//     console.log('HTTP server closed')
//   })
// })
