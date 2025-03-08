const socket = io();

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    fetch("/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryResult: { intent: { displayName: "order_status" } } })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("chat-box").innerHTML += `<p>You: ${userInput}</p>`;
    });
}

socket.on("bot_response", (message) => {
    document.getElementById("chat-box").innerHTML += `<p>Bot: ${message}</p>`;
});