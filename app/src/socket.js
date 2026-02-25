import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
  if (!socket) {
    socket = io("http://localhost:5001", {
      auth: { token }
    });
  }

  return socket;
}

export function getSocket() {
  return socket;
}