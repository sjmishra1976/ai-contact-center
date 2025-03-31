// twilioHandler.js
const twilio = require("twilio");

// Twilio environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "your_account_sid";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your_auth_token";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "your_twilio_number";
const AGENT_PHONE_NUMBER = process.env.AGENT_PHONE_NUMBER || "agent_phone_number";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Handles escalation to a live agent
 * Triggered by the `/escalate` endpoint in `app.js`
 */
const escalateToAgent = async (req, res) => {
    const { customerNumber, message } = req.body;

    if (!customerNumber || !message) {
        return res.status(400).send({ error: "Customer number and message are required" });
    }

    try {
        console.log(`Escalating to agent: ${AGENT_PHONE_NUMBER}`);

        // Send SMS to agent
        const smsResponse = await client.messages.create({
            body: `Customer: ${customerNumber}\nMessage: ${message}`,
            from: TWILIO_PHONE_NUMBER,
            to: AGENT_PHONE_NUMBER
        });

        console.log("SMS sent to agent:", smsResponse.sid);

        res.status(200).send({
            message: "Escalation to agent successful",
            sid: smsResponse.sid
        });

    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).send({ error: "Failed to escalate to agent" });
    }
};

/**
 * Sends an SMS response back to the customer
 */
const sendSmsResponse = async (customerNumber, message) => {
    try {
        console.log(`Sending SMS to customer: ${customerNumber}`);

        const messageResponse = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: customerNumber
        });

        console.log(`SMS sent successfully: ${messageResponse.sid}`);
        return messageResponse.sid;

    } catch (error) {
        console.error("Error sending SMS:", error);
        throw new Error("Failed to send SMS");
    }
};

module.exports = {
    escalateToAgent,
    sendSmsResponse
};
