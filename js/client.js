const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('notification.mp3');

// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') audio.play();
};

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Prompt for user's name and emit event
let name = '';
while (!name) {
    name = prompt("Enter your name to join").trim();
}
socket.emit('new-user-joined', name);

// Event listener for a new user joining
socket.on('user-joined', (name) => {
    if (name) {
        append(`${name} joined the chat`, 'right');
    }
});

// Event listener for receiving messages
socket.on('receive', (data) => {
    if (data && data.name && data.message) {
        append(`${data.name}: ${data.message}`, 'left');
    }
});

// Event listener for a user leaving the chat
socket.on('left', (name) => {
    if (name) {
        append(`${name} left the chat`, 'left');
    }
});
