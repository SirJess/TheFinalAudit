require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { spawn } = require("child_process"); // Jay added this line
const http = require("http"); // Required for WebSockets
const socketIo = require("socket.io"); // WebSockets

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, { cors: { origin: "*" } }); // WebSocket server



// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceKey.json")),
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("startProcess", () => {
    console.log("Processing started...");
    const pythonProcess = spawn("python3", ["./Models/combinedModel.py"]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", () => {
      console.log("Python script finished.");
      socket.emit("processComplete", output);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(8080, () => console.log("Server running on port 8080"));

