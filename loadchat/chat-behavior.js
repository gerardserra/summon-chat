
function toggleInitialMessage() {
    const initialMessage = document.querySelector('.initial-message');
    if (initialMessage) {
      initialMessage.style.display = 'none'; // Hide the initial message if it exists
    }
  }

function createNewChat() {
    var chatBody = document.getElementById('chatBody');
    chatBody.innerHTML = ''; // Clear all messages
    createEmptyMessage();
}

// Function to simulate sending a message to an endpoint and receiving a response
function sendMessageToServer(message) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate a response from the server
      const serverResponse =
        "This is the response from the server to your message: " + message;
      resolve(serverResponse);
    }, 2000); // 2 seconds delay
  });
}

function getTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0"); // Format hours with leading zero
  const minutes = now.getMinutes().toString().padStart(2, "0"); // Format minutes with leading zero
  return `${hours}:${minutes}`;
}

function updateTimeIndicator(messageDiv) {
  const timeIndicator = messageDiv.querySelector(".time-indicator");
  if (timeIndicator) {
    timeIndicator.textContent = getTime();
  }
}

// Function to scroll to the bottom of the chat with spacing
function scrollToBottomWithSpacing() {
  const chatBody = document.getElementById("chatBody");
  chatBody.scrollTop = chatBody.scrollHeight + 0; // Subtract N pixels for spacing
}

function createEmptyMessage(){
// Add a placeholder message for initial chat state
var initialMessageDiv = document.createElement('div');
initialMessageDiv.classList.add('initial-message');
initialMessageDiv.innerHTML = `
  Hey, how can I help you today?
`;
chatBody.appendChild(initialMessageDiv);
}




//CHAT LOADER
function loadChatHistory() {
  // Make an API call to retrieve a list of chat IDs
  fetch('your_endpoint_url_here')
    .then((response) => response.json())
    .then((data) => {
      // Get the dropdown element
      const chatDropdown = document.getElementById('chatDropdown');

      // Clear existing options
      chatDropdown.innerHTML = '<option value="" disabled selected>Select a Chat</option>';

      // Populate the dropdown with chat IDs
      data.forEach((chat) => {
        const option = document.createElement('option');
        option.value = chat.id; // Assuming 'id' is the property in your chat data
        option.textContent = chat.id; // Display the chat ID
        chatDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error loading chat history:', error);
    });
}


// Function to toggle the chat dropdown
function toggleChatHistory() {
  const chatDropdownContainer = document.getElementById('chatDropdownContainer');
  if (chatDropdownContainer.style.display === 'none' || chatDropdownContainer.style.display === '') {
    chatDropdownContainer.style.display = 'block';
  } else {
    chatDropdownContainer.style.display = 'none';
  }
}

function loadSelectedChat() {
  const chatDropdown = document.getElementById('chatDropdown');
  const selectedChatId = chatDropdown.value;

  // Check if a chat ID is selected
  if (selectedChatId) {
    // Make an API call to load the selected chat based on the 'selectedChatId'
    // Update your chat loading logic here
    console.log("chat whatever")
  }
}






//CHAT INPUT
// Event listener for the chat input
document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("chatInput");
  var chatBody = document.getElementById("chatBody");
  createEmptyMessage();
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      var message = input.value.trim();
      if (message) {
        // Create a new div for the user message and append it to chatBody
        var userMessageDiv = document.createElement("div");
        userMessageDiv.classList.add("chat-message", "user-message");
        userMessageDiv.textContent = message;
        chatBody.appendChild(userMessageDiv);

        // Add a time indicator to the user message
        var timeIndicator = document.createElement("div");
        timeIndicator.classList.add("time-indicator");
        timeIndicator.textContent = getTime(); // Call a function to get the current time
        userMessageDiv.appendChild(timeIndicator); // Append the time indicator to the user message div

        // Scroll to the new message
    

        // Clear the input
        input.value = "";

        // Create a new div for the server message and append it to chatBody
        var serverMessageDiv = document.createElement("div");
        serverMessageDiv.classList.add("chat-message", "server-message");
        chatBody.appendChild(serverMessageDiv);

        // Add response content
        var serverMessageContent = document.createElement("div");
        serverMessageContent.textContent = "Thinking...";

        serverMessageDiv.appendChild(serverMessageContent);

        scrollToBottomWithSpacing();


        // Simulate sending the message and getting a response
        sendMessageToServer(message).then((response) => {
          serverMessageContent.textContent = response;

          // Add a time indicator to the server message
          var serverTimeIndicator = document.createElement("div");
          serverTimeIndicator.classList.add("time-indicator", "left"); // Align left for server messages
          serverTimeIndicator.textContent = getTime();
          serverMessageDiv.appendChild(serverTimeIndicator);

          // Scroll to the new message
          scrollToBottomWithSpacing();

        });
      }
    }
  });
});



document.getElementById('chatDropdown').addEventListener('change', loadSelectedChat);