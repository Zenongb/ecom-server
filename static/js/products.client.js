import { updateTable } from "./lib.js";

const filterForm = document.getElementById("filterList");
// inputs del form cambar a FormData
const catFilter = document.getElementById("category");
const availFilter = document.getElementById("available");
const priceFilter = document.getElementById("sortByPrice");

// elementos del page nav
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageDisplay = document.getElementById("page-display");

const addToCart = async pid => {
  let cart = user.cart
  let cartProd = cart.products.find(p => p.pid === pid);
  const putRes = await fetch(`/api/carts/${cart.id}/products/${pid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: (cartProd?.quantity ?? 0) + 1,
  })
    .then(res => res.json())
    .catch(err => console.log(err));
  cart = putRes.payload
  user.cart = cart
};

// abort controllers para eliminar los event listeners para la page nav
let nextAbort = new AbortController();
let prevAbort = new AbortController();

const updatePageNav = prodRes => {
  let pagesStr = "";
  if (prodRes.hasPrevPage) {
    pagesStr = `${prodRes.prevPage}-`;
    prevAbort.abort();
    prevAbort = new AbortController();
    prevBtn.removeAttribute("disabled");
    prevBtn.addEventListener(
      "click",
      () => {
        console.log(prodRes.prevLink);
        fetchProducts(prodRes.prevLink);
      },
      {
        signal: prevAbort.signal,
      }
    );
  } else {
    prevBtn.setAttribute("disabled", "disabled");
  }
  pagesStr = pagesStr + `<b>${prodRes.page}</b>`;
  if (prodRes.hasNextPage) {
    pagesStr = pagesStr + `-${prodRes.nextPage}`;
    nextAbort.abort();
    nextAbort = new AbortController();
    nextBtn.removeAttribute("disabled");
    nextBtn.addEventListener(
      "click",
      () => {
        console.log("funciona");
        fetchProducts(prodRes.nextLink);
      },
      {
        signal: nextAbort.signal,
      }
    );
  } else {
    nextBtn.setAttribute("disabled", "disabled");
  }
  pageDisplay.innerHTML = pagesStr;
};

const fetchProducts = uri => {
  fetch(uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => {
      return res.json();
    })
    .then(prodRes => {
      updateTable(prodRes.payload, true, addToCart);
      updatePageNav(prodRes);
      console.log(prodRes);
    })
    .catch(err => {
      throw err;
    });
};

// EVENT DECLARATIONS
// go to cart event
document.getElementById("goToCartPage").addEventListener("click", () => {
  window.location.href = `/carts/${user.cart.id}`;
});
// form event
filterForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("existo");
  let uri =
    "/api/products?" +
    new URLSearchParams({
      page: 1, // pedimos la primera pagina de la busqueda
      limit: 5, //tiramos un limit
      query: `available:${availFilter.checked}-category:${catFilter.value}`,
      sort: priceFilter?.value,
    });
  console.log(uri);
  fetchProducts(uri);
});

const createCart = async () => {
  // create cart
  const cartRes = await fetch("api/carts", {
    method: "POST",
    "Content-Type": "application/json",
  })
    .then(res => res.json())
    .catch(err => console.log(err));
  const cart = cartRes.payload;
  console.log("cart", cart);
  return cart
}

const getCart = async (cid) => {
  const res = await fetch(`api/carts/${cid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err));
  const cart = res.payload
  console.log(cart)
  return cart
}

const updateUser = async (data) => {
  console.log("in update user data is ", data)
  const res = await fetch(`users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .catch(err => console.log(err))
  user = res.payload
  console.log("updated user", user)
}

// MAIN EXECUTION

const userRes = await fetch("/current", {
  method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
})
  .then(res => res.json())
  .catch(err => console.log(err));

var user = userRes.payload

console.log("user is", user)
console.log("user.cart", user.cart)
if (!!!user.cart) {
  console.log("user.cart null")
  user.cart = await createCart()
  await updateUser({cart: user.cart._id})
} else if (typeof user.cart === "string") {
  console.log("user.cart string")
  const cart = await getCart(user.cart)
  user.cart = cart
} 

console.log("user is", user)

// primer fetch
fetchProducts("api/products?query=&sort=");
