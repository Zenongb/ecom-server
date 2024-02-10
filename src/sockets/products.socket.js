import { wsServer } from "../main.js";
import { productService } from "../services/index.service.js";

const pm = productService

export const connectionSocket = async socket => {
  const { paginatedProducts, _ } = await pm.getProducts({}, 0, "asc")
  socket.emit("updateProducts", paginatedProducts);
};

// SERVER SOCKETS
export const serverEmitUpdateProducts = async () => {
  const { paginatedProducts, _ } = await pm.getProducts({}, 0, "asc")
  wsServer.to("realtimeProducts").emit("updateProducts", paginatedProducts);
};
