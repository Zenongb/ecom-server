const registerForm = document.querySelector("form");

registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  const data = new FormData(registerForm);
  console.log(data);
  const res = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  }).then(res => res.json());

  console.log(res);
  if (res.status === "success") {
    window.location.href = "/login";
  }
});
