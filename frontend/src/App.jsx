import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);

    socket.emit("ai-message", inputValue);

    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    let socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-reply", (response) => {
      const newBotMessage = {
        id: messages.length + 2,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };
      setMessages((prev) => [...prev, newBotMessage]);
    });
  }, []);

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>Chat App</h1>
      </div>

      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          rows="1"
        />
        <button onClick={handleSendMessage}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
