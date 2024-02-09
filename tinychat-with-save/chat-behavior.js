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

function createMessageDiv(message, placeholderDiv) {
  // Create a new div for the server message and append it to chatBody

  if (placeholderDiv == undefined) {
    var placeholderDiv = document.createElement("div");
    placeholderDiv.classList.add("chat-message", "server-message");
    chatBody.appendChild(placeholderDiv);
  } else {
    placeholderDiv.innerHTML = "";
  }

  var serverMessageContent = document.createElement("div");
  serverMessageContent.textContent = message;
  placeholderDiv.appendChild(serverMessageContent);

  var serverTimeIndicator = document.createElement("div");
  serverTimeIndicator.classList.add("time-indicator", "left"); // Align left for server messages
  serverTimeIndicator.textContent = getTime();
  placeholderDiv.appendChild(serverTimeIndicator);
  scrollToBottomWithSpacing();
  return placeholderDiv;
}

async function sendMessageToServer(messageText, threadID) {
  // Endpoint URL
  const url = "https://dkta9n.buildship.run/tinychat";
  console.log("Sending....");

  var responsePlaceholder = createMessageDiv("Preparing chat");

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
    // Use the returned message
    if (responseData && responseData.message) {
      createMessageDiv(responseData.message, responsePlaceholder);
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

async function saveCurrentChat() {
  // Endpoint URL where you want to send globalThreadID
  const url = "https://dkta9n.buildship.run/saveChat";
  var responsePlaceholder = createMessageDiv("Saving current chat...");
  if (!globalThreadID) {
    createMessageDiv("No thread ID is set yet.", responsePlaceholder);
    console.error("No thread ID is set.");
    return;
  }
  const data = { threadID: globalThreadID };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json(); // or .text() if the response is plain text
      console.log("Thread saved successfully:", responseData);
      createMessageDiv("Chat saved.", responsePlaceholder);
    } else {
      // Handle server errors or invalid responses
      console.error("Failed to save the thread. Status:", response.status);
    }
  } catch (error) {
    // Handle network errors
    console.error("Error saving the thread:", error);
  }
}

async function getHistory() {
  const url = "https://dkta9n.buildship.run/getHistory";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      displayThreadIDs(data);
    } else {
      console.error(
        "Failed to retrieve chat history. Status:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error retrieving chat history:", error);
  }
}

function displayThreadIDs(threadIDs) {
  const selector = document.getElementById('threadSelector');
  selector.innerHTML = ''; // Clear existing options
  threadIDs.forEach(id => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = `Thread ID: ${id}`;
    selector.appendChild(option);
  });

  // Show the modal
  document.getElementById('historyModal').style.display = 'block';
}


function startChatOnPageLoad() {
  console.log("Starting Chat");
  sendMessageToServer("Hi!");
}

function appendMessageToChat(messageText) {
  var messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message");
  messageDiv.textContent = messageText; // Set the message text
  var chatBody = document.getElementById("chatBody");
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
        // Clear the input
        input.value = "";
        sendMessageToServer(message, globalThreadID);
      }
    }
  });
});

//START THE CHAT

let globalThreadID = undefined;
//startChatOnPageLoad();
