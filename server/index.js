import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on("join_room", (data) => {
    const { room } = data;
    socket.join(room);
    console.log(`User joined room : ${room}`);
  });

  socket.on("send_message", (data) => {
    const { message, room } = data;
    socket.to(room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
