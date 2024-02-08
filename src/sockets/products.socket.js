import { wsServer } from "../main.js";
import productManager from "../daos/models/product.model.js";

const pm = productManager

export const connectionSocket = async socket => {
  const { paginatedProducts, _ } = await pm.getProducts({}, 0, "asc")
  socket.emit("updateProducts", paginatedProducts);
};

// SERVER SOCKETS
export const serverEmitUpdateProducts = async () => {
  const { paginatedProducts, _ } = await pm.getProducts({}, 0, "asc")
  wsServer.to("realtimeProducts").emit("updateProducts", paginatedProducts);
};
