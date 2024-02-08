const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(loginForm);
  console.log(data);
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  }).then(res => res.json());

  console.log("res is");
  console.log(res);
  if (res.status === "success") {
    window.location.href = "/products";
  }
});
