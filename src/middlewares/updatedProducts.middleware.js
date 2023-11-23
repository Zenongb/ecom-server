import { serverEmitUpdateProducts } from "../controllers/products.controller.js";

// como podria llamar este archivo?

// este middleware se conecta al products router para propagar las
// actualizaciones de los productos a los clientes del servidor wss
export const wsUpdatedProductsPropagation = (_, res, next) => {
  // para resolver el dilema de como agregar el emit al final de la
  // cadena de calls que forman el middleware utilizamos el metodo on
  // con el param finish para que se produzca al final.
  res.on("finish", async () => {
    // TODO: checkear el estado de la respuesta para evitar la emision
    // en caso de que ocurra algun error en el proceso
    serverEmitUpdateProducts()
  })
  next();
};