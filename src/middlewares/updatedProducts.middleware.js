import { serverEmitUpdateProducts } from "../controllers/products.controller.js";

// este middleware se conecta al products router para propagar las
// actualizaciones de los productos a los clientes del servidor wss
export const wsUpdatedProductsPropagation = (_, res, next) => {
  // para resolver el dilema de como agregar el emit al final de la
  // cadena de calls que forman el middleware utilizamos el metodo on
  // con el param finish para que se produzca al final.
  res.on("finish", async () => {
    if (res.statusCode < 400) serverEmitUpdateProducts()
  })
  next();
};
