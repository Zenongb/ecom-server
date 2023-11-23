import { updateTable } from "./lib.js"

const socket = io()

socket.on("connect", () => {
  console.log("conectado")
})

socket.on("updateProducts", (products) => {
  updateTable(products)
})

const appProdForm = document.querySelector("form")

appProdForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const prodSubmit = {}
  for (let formChild of appProdForm.childNodes) {

    // console.log(formChild)
    if (formChild.nodeName === "LABEL") { // encontramos una label
      // console.log(formChild)
      const key = formChild.lastChild.attributes.name.value
      const value = formChild.lastChild.value
      prodSubmit[key] = value
      if (key === "status") {
        console.log(key, value)
        prodSubmit[key] = value === "on"
        console.log(prodSubmit[key])
      }
    }
  }
  console.log("sending form")
  console.log(prodSubmit)
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prodSubmit)
  }).then(res => {
    console.log(res.status)
  }).catch(err => {
    console.log(err)
  })
})