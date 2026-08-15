import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import socket from "./socket";
import "./index.css";


console.log("MAIN FILE RUNNING");


socket.on("connect", () => {
  console.log("🟢 Connected to Socket.IO:", socket.id);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);