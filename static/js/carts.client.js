const mainElem = document.querySelector("main")

const res = await fetch(`/api/carts/${cid}`, {
  method: "GET",
  "Content-Type": "application/json",
})
  .then(res => res.json())
  .catch(err => console.log(err));

if (res.status === "error") {
  alert(`error al buscar el carrito, mensaje de error: ${res.message}`)
}
const cart = res.payload
console.log(cart)

const cartElement = document.createElement("h5")
cartElement.innerHTML = cart._id
mainElem.appendChild(cartElement)

const productsList = document.createElement("ul")
for (let prod of cart.products) {
  const prodElement = document.createElement("li")
  prodElement.innerHTML = `<b>Cantidad:</b> ${prod.quantity} <b>Producto:</b> ${prod.pid.title}, ${prod.pid.description}, ${prod.pid.status}`
  productsList.appendChild(prodElement)
}
mainElem.appendChild(productsList)