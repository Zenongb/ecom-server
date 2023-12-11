import { wsServer } from "../app.js";
import productManager from "../dao/models/product.model.js";

const pm = productManager

export const productsConnection = async socket => {
  const products = await pm.getProducts()
  socket.emit("updatedProducts", products);
};

// SERVER SOCKETS
export const serverEmitUpdateProducts = async () => {
  const products = await pm.getProducts()
  wsServer.to("realtimeProducts").emit("updatedProducts", products);
};