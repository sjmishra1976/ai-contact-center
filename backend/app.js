// app.js - Main Express.js Server
const express = require("express");
const bodyParser = require("body-parser");
const dialogflowHandler = require("./dialogflowHandler");
const twilioHandler = require("./twilioHandler");
const crmIntegration = require("./crmIntegration");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// WebSocket connection
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Dialogflow Fulfillment Endpoint
app.post("/webhook", (req, res) => {
    dialogflowHandler.handleRequest(req, res, (responseText) => {
        io.emit("bot_response", responseText);
    });
});

// Twilio Agent Escalation Endpoint
app.post("/escalate", twilioHandler.escalateToAgent);

// CRM Order Status Endpoint
app.post("/get-order-status", crmIntegration.getOrderStatus);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});