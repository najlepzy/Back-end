import { Server } from "socket.io";

export function SocketIo(server, products) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.emit("update products", products);

    socket.on("chat message", (message) => {
      console.log("Message: " + message);
      io.emit("chat message", message);
    });
  });
}
