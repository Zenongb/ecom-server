const mainElem = document.querySelector("main")
const buyBtn = document.getElementById('buyCart')


const makeList = () => {
  mainElem.innerHTML = ""
  const cartElement = document.createElement("h5")
  cartElement.innerHTML = cart.id
  mainElem.appendChild(cartElement)
  const productsList = document.createElement("ul")
  for (let prod of cart.products) {
    const prodElement = document.createElement("li")
    prodElement.innerHTML = `<b>Cantidad:</b> ${prod.quantity} <b>Producto:</b> ${prod.pid.title}, ${prod.pid.description}, ${prod.pid.status}`
    productsList.appendChild(prodElement)
  }
  mainElem.appendChild(productsList)
}


buyBtn.addEventListener("click", async () => {
  fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      cart = json.payload.cart
      makeList()
    })
})

const res = await fetch(`/api/carts/${cid}?` + new URLSearchParams({
  populate: true
}), {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then(res => res.json())
  .catch(err => console.log(err));

if (res.status === "error") {
  alert(`error al buscar el carrito, mensaje de error: ${res.message}`)
}
var cart = res.payload
console.log(cart)

makeList()

