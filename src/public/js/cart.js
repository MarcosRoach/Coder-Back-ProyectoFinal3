const socket = io();

// Socket.on
socket.on("getCart", (cart) => {
  console.log(cart);
});
