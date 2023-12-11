const display = document.getElementById("display");
const chatForm = document.getElementById("newMessage");
const messageInput = document.getElementById("message-input")

const user = prompt("Nombre de usuario!");
console.log(`hola ${user}!`);

const socket = io();
socket.on("connect", async () => {
  console.log("conectado");
  await socket.emit("join", "messager");
  socket.emit("joinedRoom");
});

socket.on("getMessages", messages => {
  console.log("nuevos mensajes");
  console.log(messages);
  for (let msg of messages) {
    console.log(msg)
    renderMessage(msg)
  }
});

socket.on("newMessage", message => {
  renderMessage(message)
});

chatForm.addEventListener("submit", event => {
  event.preventDefault()
  const message = messageInput.value
  socket.emit("newMessage", {
    user: user,
    body: message
  })
  chatForm.reset()
})

const renderMessage = msg => {
  const li = document.createElement("li")
  const ts = new Date(msg.timestamp)
  li.innerHTML = `${ts.getDate()}/${ts.getMonth()} ${ts.getHours()}:${ts.getMinutes()} @${msg.user}: ${msg.body}`
  display.appendChild(li)
};
