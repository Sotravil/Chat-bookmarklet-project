javascript:(function() {
  // Crear estilos CSS
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

  // Crear burbuja flotante
  const bubble = document.createElement('div');
  bubble.id = 'floatingChatBubble';
  document.body.appendChild(bubble);

  // Crear contenedor de chat
  const chatContainer = document.createElement('div');
  chatContainer.id = 'chatContainer';

  // Crear área de mensajes
  const chatMessages = document.createElement('div');
  chatMessages.id = 'chatMessages';
  chatContainer.appendChild(chatMessages);

  // Crear input y botón de enviar
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

  // Cargar mensajes desde localStorage
  function loadMessages() {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.innerHTML = '';
    savedMessages.forEach(({ message, type }) => {
      addMessage(message, type);
    });
  }

  // Guardar mensajes en localStorage
  function saveMessage(message, type) {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.push({ message, type });
    localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
  }

  // Función para agregar mensajes
  function addMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type === 'user' ? 'userMessage' : 'responseMessage');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Enviar mensaje con botón o teclado (Enter)
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, 'user');
      saveMessage(message, 'user');
      chatInput.value = '';
      // Simulación de respuesta
      setTimeout(() => {
        const response = 'Respuesta del sistema: ' + message;
        addMessage(response, 'response');
        saveMessage(response, 'response');
      }, 500);
    }
  }

  // Evento para enviar con botón
  sendButton.addEventListener('click', sendMessage);

  // Evento para enviar con tecla Enter
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Mostrar/ocultar chat al tocar la burbuja
  bubble.addEventListener('click', function() {
    if (chatContainer.style.display === 'none') {
      chatContainer.style.display = 'flex';
      loadMessages(); // Cargar mensajes al abrir
    } else {
      chatContainer.style.display = 'none';
    }
  });

  // Hacer que la burbuja sea arrastrable con eventos táctiles
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
