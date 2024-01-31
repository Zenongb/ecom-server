import { wsServer } from "../main.js";
import { connectionSocket } from './products.socket.js'

// conectar sockets
wsServer.on("connect", connectionSocket)
