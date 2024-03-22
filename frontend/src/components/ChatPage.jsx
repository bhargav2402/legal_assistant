import React, { useState, useEffect } from 'react';
import Message from './Message'; 
import { BsFillChatDotsFill, BsFillChatSquareDotsFill } from "react-icons/bs";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newMessage = { text: inputValue, fromUser: true };
      setMessages([...messages, newMessage]);
      setInputValue('');
      fetchResponseFromAPI(inputValue).then(response => {
        const newResponseMessage = { text: response, fromUser: false };
        setMessages([...messages, newMessage, newResponseMessage]);
      });
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat AI</h1>
        <div>
          <BsFillChatDotsFill size={24} onClick={toggleHistory} />
          {/* <BsFillChatSquareDotsFill size={24} /> */}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex">
        {showHistory && (
          <div className="w-64 bg-gray-100 h-[80vh] px-4 py-0 pt-0 border-r-2 border-gray-300 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Chat History</h2>

          </div>
        )}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <Message key={index} text={message.text} fromUser={message.fromUser} />
          ))}
        </div>
      </div>

      <form onSubmit={handleMessageSubmit} className="bg-gray-300 p-4 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-900 text-white px-4 py-2 ml-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatUI;
