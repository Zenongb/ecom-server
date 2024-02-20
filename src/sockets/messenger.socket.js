import { wsServer } from "../main.js"
import {msgService} from "../services/index.service.js"

const mm = msgService

// planeo hacer que el sistema de chat funcione unicamente desde sockets,
// principalmente porque me interesa aprender mas del uso de wss y socket.io.
// Además me parece que para optimizar la velocidad de la aplicación es mejor
// realizar la creacion de nuevos mensajes desde la conexion de wss, como tambien
// en vez de actualizar el listado de mensajes completo, como hacia en realtimeProducts,
// voy a "appendear" los nuevos mensajes a la lista que el cliente tiene. Finalmente 
// cuando el cliente se conecte le voy a dar los ultimos 20 mensajes que se dieron

export const messengerConnection = async socket => {
  try {
    const lastMessages = await mm.getLastMessages()
    socket.emit("getMessages", lastMessages)
  } catch (err) {
    logger.log("error", err)   
  }
}

export const newMessage = async (msg) => {
  try {
    // este check se debe hacer en el model
    if (!!msg.body) {
      const message = await mm.addMessage(msg)
      wsServer.to("messenger").emit("newMessage", message)
    }
  } catch (err) {
    logger.log("error", err)   
  }
}
