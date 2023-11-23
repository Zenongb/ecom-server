import { updateTable } from "./lib.js";

const products = await fetch("/api/products", {
  method: "GET",
  "Content-Type": "application/json",
}).then((res) => {
  return res.json()
}).catch((err) => {
  throw err
});

// el código desde aca para abajo me gustaria fragmentar para poder utilizar en el 
// realtime products sin tener que copiar y pegar

updateTable(products)