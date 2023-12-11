import express from "express";
import http from "node:http";
import { Server } from "socket.io";

import handlebars from "express-handlebars";
import mongoose from "mongoose";

import { DB_URL, PORT } from "./config.js";

// Routers import
import { webRouter } from "./routers/web.router.js";
import { apiRouter } from "./routers/api.router.js";

// socket handlers import
import { initClient } from "./sockets/index.js";

const app = express();
const httpServer = http.createServer(app);
export const wsServer = new Server(httpServer);
wsServer.on("connect", socket => {
  initClient(socket)
});

mongoose.connect(DB_URL);

// handlebars engine
app.engine("handlebars", handlebars.engine());
app.set("views", "./views");

// standard app middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// instanciar el servidor http
httpServer.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});

// static routes
app.use(express.static("./public"));
app.use(express.static("./views"));
app.use("/static", express.static("./static"));

// ROUTES
app.use("/api", apiRouter);

app.use("/", webRouter);

// Realizamos un graceful shutdown del sistema
process.on("SIGTERM", () => {
  console.log("Cerrando Servidor.");
  // cerramos la conexion a la db
  mongoose.connection.close();
  // cerramos el servidor
  httpServer.close(() => {
    console.log("HTTP server closed");
  });
});
