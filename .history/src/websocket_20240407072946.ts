import { io } from "./app";

io.on("connection", (socket) => {
  socket.emit("connect", { message: "a new client connected" });
});
