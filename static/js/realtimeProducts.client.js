import { updateTable } from "./lib.js";

// Websockets handling
const socket = io();

socket.on("connect", async () => {
  console.log("conectado");
  await socket.emit("join", "realtimeProducts")
  socket.emit("joinedRoom")
});

socket.on("updateProducts", products => {
  console.log("products son", products)
  updateTable(products);
});

const addProdForm = document.getElementById("addProduct");

addProdForm.addEventListener("submit", event => {
  event.preventDefault();
  const prodSubmit = new FormData(addProdForm)
  console.log("sending form");
  console.log(prodSubmit);
  let res = fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(prodSubmit.entries())),
  })
    .then(res => res.json())
    .catch(err => {
      console.log("err is",err);
    });
  console.log("res is", res)
});

document.getElementById("deleteProduct").addEventListener("submit", event => {
  event.preventDefault();
  const pid = document.getElementById("pid").value;
  console.log(pid);
  fetch(`/api/products/${pid}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err))
});
