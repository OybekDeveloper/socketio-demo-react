import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("itsrom",data);
    console.log(`User joined room : ${data} usr${socket.id}`);
  });

  socket.on("send_message", (data) => {
    // const { message, room } = data;
    console.log("sec",data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
