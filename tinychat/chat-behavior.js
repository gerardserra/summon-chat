//HELPERS

function toggleInitialMessage() {
  const initialMessage = document.querySelector(".initial-message");
  if (initialMessage) {
    initialMessage.style.display = "none"; // Hide the initial message if it exists
  }
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

function createEmptyMessage() {
  // Add a placeholder message for initial chat state
  var initialMessageDiv = document.createElement("div");
  initialMessageDiv.classList.add("initial-message");
  initialMessageDiv.innerHTML = `
  Hey, how can I help you today?
`;
  chatBody.appendChild(initialMessageDiv);
}

// Function to scroll to the bottom of the chat with spacing
function scrollToBottomWithSpacing() {
  const chatBody = document.getElementById("chatBody");
  chatBody.scrollTop = chatBody.scrollHeight + 0; // Subtract N pixels for spacing
}

// Function to simulate sending a message to an endpoint and receiving a response
function simulateMessageServer(message) {
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

//CHAT LOGIC

function createNewChat() {
  var chatBody = document.getElementById("chatBody");
  chatBody.innerHTML = ""; // Clear all messages
  globalThreadID = false;
  sendMessageToServer("Hi!");
}

function createPlaceholder() {
  // Create a new div for the server message and append it to chatBody
  var serverMessageDiv = document.createElement("div");
  serverMessageDiv.classList.add("chat-message", "server-message");
  chatBody.appendChild(serverMessageDiv);

  // Add response content
  var serverMessageContent = document.createElement("div");
  serverMessageContent.textContent = "Thinking...";

  serverMessageDiv.appendChild(serverMessageContent);


  // Simulate sending the message and getting a response
  return serverMessageDiv;
}
async function sendMessageToServer(messageText, threadID) {
  // Endpoint URL
  const url = "https://dkta9n.buildship.run/restaurant-manager";
  console.log("Sending....");
  

  var responsePlaceholder = createPlaceholder("");

  // Prepare the request body
  const data = {
    message: "" + messageText,
    threadID: threadID,
  };

  console.log(data);
  try {
    const response = await fetch(url, {
      method: "POST", // or 'GET' if your endpoint expects a GET request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json(); // Convert the response to JSON
    console.log(responseData);
    // Use the returned response
    if (responseData && responseData.response) {
      const htmlContent = marked.parse(responseData.response);
      responsePlaceholder.innerHTML = htmlContent;
      var serverTimeIndicator = document.createElement("div");
      serverTimeIndicator.classList.add("time-indicator", "left"); // Align left for server messages
      serverTimeIndicator.textContent = getTime();
      responsePlaceholder.appendChild(serverTimeIndicator);
      scrollToBottomWithSpacing();
      globalThreadID = responseData.threadID;
    } else {
      console.error("Message data is missing");
    }
  } catch (error) {
    // Handle any errors
    console.error("Error sending message:", error);
    appendMessageToChat("Error sending message. Please try again.");
  }
}

function startChatOnPageLoad() {
  console.log("Starting Chat");
  sendMessageToServer("Hi!");
}

function appendMessageToChat(messageText) {
  // Create a new chat message element
  var messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message");
  messageDiv.textContent = messageText; // Set the message text

  var chatBody = document.getElementById("chatBody");
  // Append the message to the chat body
  chatBody.appendChild(messageDiv);
}

// Event listener for the chat input
document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("chatInput");
  var chatBody = document.getElementById("chatBody");
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

        sendMessageToServer(message, globalThreadID);
      }
    }
  });
});

//START THE CHAT

let globalThreadID = undefined;
startChatOnPageLoad();

