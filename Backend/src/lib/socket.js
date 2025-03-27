import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
})

export function getRecieverSocketId(userId) {
    return userSocketMap[userId]; // return the socket id for the user
}

// uded to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const userId = socket.handshake.query.userId; // userId is passed as a query parameter
    if (userId) userSocketMap[userId] = socket.id; // store the socket id for the user

    //io.emit() is used to send a message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // send the list of online users to all clients
    //getOnlineUsers is the event name that will be used to send the list of online users to all clients
    //io.emit() is used to send a message to all connected clients

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        delete userSocketMap[userId]; // remove the socket id from the userSocketMap
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // send the list of online users to all clients
    });
});

export { io, app, server };