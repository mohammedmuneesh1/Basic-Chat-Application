// src/socket.js
import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "http://localhost:8080";

export const socketSetup = io(SOCKET_URL, {
  transports: ["websocket"], // ensures stable connection
  reconnection: true,
  // reconnectionAttempts: 5,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
    // auth: { token },
});


//SOCKET IO NOTES 

//socket.off() is used to remove event listeners that were added using socket.on().
// Why?

// If you don’t remove listeners when the component unmounts (or re-renders),
// you might end up with duplicate event handlers — meaning:
// every message received might trigger multiple times,
// causing memory leaks or repeated logs.
// socket.on("message", handler) → attaches listener
// socket.off("message") → detaches listener on cleanup


