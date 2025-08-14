import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "https://chatapp-cjbxh4gbhtcfezf7.eastus-01.azurewebsites.net",
    "http://localhost:3000",
	"http://localhost:5000"
  ],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		// ✅ ADD localhost:3001 or whatever port your React app runs on
		origin: ["https://chat-app-760b.onrender.com", "http://localhost:3000", "https://chatapp-cjbxh4gbhtcfezf7.eastus-01.azurewebsites.net"],
		methods: ["GET", "POST", "PUT", "DELETE"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;

	if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };