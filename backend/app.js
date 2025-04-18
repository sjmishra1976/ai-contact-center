// app.js - Main Express.js Server
const express = require("express");
const bodyParser = require("body-parser");
const mcpHandler = require("./mcp/mcpHandler");
const dialogflowHandler = require("./dialogflowHandler");
//const twilioHandler = require("./twilioHandler");
const crmIntegration = require("./crmIntegration");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

// WebSocket connection
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

//agentic ai MCP Server based endpoint call from MCP client
app.post("/webhook", async (req, res) => {
    try {
        const user_input = req.body.query;
        console.log("User Query :", user_input);
        const reply = await mcpHandler.handleMCPMessage(user_input, "webhook",  "basic_query");
        io.emit("bot_response", reply.response);
        res.json({ response: reply.response });
        console.log("reply response:"+ reply.response);
    }catch (error) {
        console.error("Error fetching data from mcp server:", error);
        res.status(500).send({ error: "Error fetching data from mcp server" });
    }
});
  

// Rasa Fulfillment Endpoint
app.post("/webhook-rasa", async (req, res) => {
    try {
        const message = req.body.query;
        const rasaResponse = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
            sender: "user",
            message: message
        })

        console.log("response:"+ rasaResponse.data);
        const responseText = rasaResponse.data.map((msg) => msg.text).join("\n");
        io.emit("bot_response", responseText);
        res.json({ response: responseText });

    } catch (error) {
        console.error("Error communicating with Rasa:", error);
        res.status(500).send("Failed to communicate with Rasa");
    }
});



// Dialogflow Fulfillment Endpoint
app.post("/webhook-dialogflow", (req, res) => {
    dialogflowHandler.handleRequest(req, res, (responseText) => {
        io.emit("bot_response", responseText);
    });
});

// Twilio Agent Escalation Endpoint
/*app.post("/escalate", async (req, res) => {
    try {
        await twilioHandler.escalateToAgent(req, res);
    } catch (error) {
        console.error("Error escalating to agent:", error);
        res.status(500).send({ error: "Failed to escalate to agent" });
    }
});*/

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
