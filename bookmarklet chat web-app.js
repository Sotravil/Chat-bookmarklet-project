javascript:(function() {
  // Create CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
    #floatingChatBubble {
      position: fixed;
      width: 60px;
      height: 60px;
      bottom: 20px;
      right: 20px;
      background: radial-gradient(circle, black 50%, blue);
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
    }

    #chatContainer {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 300px;
      height: 400px;
      background-color: black;
      border: 1px solid blue;
      border-radius: 10px;
      display: none;
      flex-direction: column;
      z-index: 9999;
    }

    #chatMessages {
      flex-grow: 1;
      padding: 10px;
      overflow-y: auto;
      color: white;
    }

    .message {
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 5px;
    }

    .userMessage {
      background-color: blue;
      text-align: right;
    }

    .responseMessage {
      background-color: green;
      text-align: left;
    }

    #chatInputContainer {
      display: flex;
      padding: 10px;
      background-color: black;
    }

    #chatInput {
      flex-grow: 1;
      padding: 8px;
      background-color: white;
      border: none;
      border-radius: 5px;
      color: black;
      outline: none;
    }

    #sendButton {
      padding: 8px 12px;
      margin-left: 10px;
      background-color: blue;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Create floating chat bubble
  const bubble = document.createElement('div');
  bubble.id = 'floatingChatBubble';
  document.body.appendChild(bubble);

  // Create chat container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatContainer';

  // Create chat messages area
  const chatMessages = document.createElement('div');
  chatMessages.id = 'chatMessages';
  chatContainer.appendChild(chatMessages);

  // Create input and send button
  const chatInputContainer = document.createElement('div');
  chatInputContainer.id = 'chatInputContainer';
  const chatInput = document.createElement('input');
  chatInput.id = 'chatInput';
  chatInput.type = 'text';
  chatInput.placeholder = 'Escribe un mensaje...';
  const sendButton = document.createElement('button');
  sendButton.id = 'sendButton';
  sendButton.innerText = 'Enviar';

  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);
  chatContainer.appendChild(chatInputContainer);
  document.body.appendChild(chatContainer);

  // Load messages from localStorage
  function loadMessages() {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.innerHTML = '';
    savedMessages.forEach(({ message, type }) => {
      addMessage(message, type);
    });
  }

  // Save messages to localStorage
  function saveMessage(message, type) {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.push({ message, type });
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
  }

  // Function to add messages to chat
  function addMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type === 'user' ? 'userMessage' : 'responseMessage');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message to server using fetch
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, 'user');
      saveMessage(message, 'user');
      chatInput.value = '';

      // Send message to server
      fetch('https://your-ngrok-url.ngrok.io/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      .then(response => response.json())
      .then(data => {
        // Display server response
        const responseMessage = data.reply;
        addMessage(responseMessage, 'response');
        saveMessage(responseMessage, 'response');
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }

  // Event listener for send button
  sendButton.addEventListener('click', sendMessage);

  // Event listener for Enter key
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Show/hide chat when clicking the bubble
  bubble.addEventListener('click', function() {
    if (chatContainer.style.display === 'none') {
      chatContainer.style.display = 'flex';
      loadMessages(); // Load messages when opening
    } else {
      chatContainer.style.display = 'none';
    }
  });

  // Make the bubble draggable (touch events)
  bubble.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    let offsetX = touch.clientX - bubble.getBoundingClientRect().left;
    let offsetY = touch.clientY - bubble.getBoundingClientRect().top;

    function touchMoveHandler(e) {
      const touchMove = e.touches[0];
      bubble.style.left = `${touchMove.clientX - offsetX}px`;
      bubble.style.top = `${touchMove.clientY - offsetY}px`;
    }

    document.addEventListener('touchmove', touchMoveHandler);

    document.addEventListener('touchend', function() {
      document.removeEventListener('touchmove', touchMoveHandler);
    }, { once: true });
  });
})();
