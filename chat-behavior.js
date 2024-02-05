document.getElementById("chatInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    var message = this.value.trim();
    if (message) {
      // Create a new div element for the message
      var messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-message", "user-message");
      messageDiv.textContent = message;

      // Append the new message to the chat body
      var chatBody = document.getElementById("chatBody");
      chatBody.appendChild(messageDiv);

      // Scroll to the bottom of the chat body
      chatBody.scrollTop = chatBody.scrollHeight;

      // Clear the input field
      this.value = "";
    }
  }
});

function createNewChat() {
    var chatBody = document.getElementById('chatBody');
    chatBody.innerHTML = ''; // Clear all messages
}