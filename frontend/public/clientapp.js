const socket = io();

function sendMessage() {
  const userInputElem = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userInput = userInputElem.value;

  // Return if the input is empty or only whitespace
  if (!userInput.trim()) return;

  fetch("/webhook", { // Use the full URL if needed (here assuming same host)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: userInput })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // Append the user's message to the chat box
      chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
      
      // Optionally log the server response
      console.log("Server response:", data.response);
      
      // Clear the input field after sending
      userInputElem.value = "";
      
      // Auto-scroll chat box to the bottom
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      console.error("Error sending message:", error);
      chatBox.innerHTML += `<p style="color: red;">Error sending message.</p>`;
    });
}

socket.on("bot_response", (message) => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><strong>Bot:</strong> ${message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});
