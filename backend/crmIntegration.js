// crmIntegration.js
const axios = require("axios");

// CRM environment variables
const CRM_API_URL = process.env.CRM_API_URL || "https://your-crm-api.com";
const CRM_API_KEY = process.env.CRM_API_KEY || "your_api_key";

/**
 * Fetches order status from the CRM
 */
const getOrderStatus = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).send({ error: "Order ID is required" });
    }

    try {
        console.log(`Fetching order status for ID: ${orderId}`);

        const response = await axios.get(`${CRM_API_URL}/orders/${orderId}`, {
            headers: {
                "Authorization": `Bearer ${CRM_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const orderData = response.data;

        // Example response structure
        const orderStatus = {
            orderId: orderData.id,
            status: orderData.status,
            customer: orderData.customer,
            total: orderData.total,
            items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        console.log("Order Status:", orderStatus);

        res.status(200).send(orderStatus);

    } catch (error) {
        console.error("CRM Error:", error.message);
        res.status(500).send({
            error: "Failed to fetch order status",
            details: error.response?.data || "No additional details"
        });
    }
};

module.exports = { getOrderStatus };
