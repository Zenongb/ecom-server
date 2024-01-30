import { updateTable } from "./lib.js";

// Websockets handling
const socket = io();

socket.on("connect", () => {
  console.log("conectado");
});

socket.on("updateProducts", products => {
  console.log("products son", products)
  updateTable(products);
});

const addProdForm = document.getElementById("addProduct");

addProdForm.addEventListener("submit", event => {
  event.preventDefault();
  const prodSubmit = {};
  for (let formChild of addProdForm.childNodes) {
    // console.log(formChild)
    if (formChild.nodeName === "LABEL") {
      // encontramos una label
      // console.log(formChild)
      const key = formChild.lastChild.attributes.name.value;
      const value = formChild.lastChild.value;
      prodSubmit[key] = value;
      if (key === "status") {
        prodSubmit[key] = formChild.lastChild.checked
        console.log(prodSubmit[key]);
      }
    }
  }
  console.log("sending form");
  console.log(prodSubmit);
  let res = fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prodSubmit),
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
