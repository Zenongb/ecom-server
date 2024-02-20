import { productsConnection } from "./products.socket.js";
import { messengerConnection, newMessage } from "./messenger.socket.js";


export const initClient = socket => {
  socket.on("join", room => {
    socket.join(room);
    logger.log("debug", "client joined room", room);
    socket.emit("joinedRoom")
  });
  socket.on("joinedRoom", () => {
    logger.log("debug", "executing joinedRoom event")
    productsConnection(socket);
    messengerConnection(socket);
  })
  socket.on("newMessage", msg => newMessage(msg))
};
