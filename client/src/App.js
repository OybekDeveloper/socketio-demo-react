import { useEffect, useState } from "react";
import io from "socket.io-client";
import logo from "./logo.svg";
import notificationSound from "./sound/notification-sound.mp3";
const socket = io.connect("http://localhost:4000");
function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [resive, setResive] = useState([]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room !== "") {
      socket.emit("join_room", room);
      setResive([]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message !== "" && room !== "") {
      socket.emit("send_message", { message, room });
      setMessage("");
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setResive((prev) => [...prev, data.message]);
      const sound = new Audio(notificationSound);
      sound.play();
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, []);

  return (
    <div className="App">
      <form className="row container mt-2">
        <div className="mb-3 col-6">
          <input
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
            className="form-control"
            name="room"
            placeholder="Enter the room number"
          />
        </div>
        <div className="mb-3 col-6">
          <button
            onClick={handleJoinRoom}
            type="submit"
            className="btn btn-primary asdfsadfasdf"
          >
            Join
          </button>
        </div>
        <div className="mb-3 col-6">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="form-control"
            name="message"
            placeholder="Enter your message here..."
          />
        </div>
        <div className="mb-3 col-6">
          <button
            onClick={handleSendMessage}
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="container text-white">
        <h1>Messages</h1>
        {resive.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <img className="logo" src={logo} alt="logo" />
    </div>
  );
}

export default App;
