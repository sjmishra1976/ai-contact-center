// app.js - Main Express.js Server
const express = require("express");
const bodyParser = require("body-parser");
const dialogflowHandler = require("./dialogflowHandler");
const twilioHandler = require("./twilioHandler");
const crmIntegration = require("./crmIntegration");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

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
app.post("/escalate", async (req, res) => {
    try {
        await twilioHandler.escalateToAgent(req, res);
    } catch (error) {
        console.error("Error escalating to agent:", error);
        res.status(500).send({ error: "Failed to escalate to agent" });
    }
});

// CRM Order Status Endpoint
app.post("/get-order-status", async (req, res) => {
    try {
        await crmIntegration.getOrderStatus(req, res);
    } catch (error) {
        console.error("Error fetching order status:", error);
        res.status(500).send({ error: "Failed to fetch order status" });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
