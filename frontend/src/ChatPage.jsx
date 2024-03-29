import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/SideBar";
import { ChatArea } from "./components/ChatArea";
import { MessageInput } from "./components/MessageInput";

function ChatPage() {
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [model, setModel] = useState("mixtral-8x7b-32768");
  const [conversationalMemoryLength, setConversationalMemoryLength] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("trying");
      try {
        const response = await axios.get("http://127.0.0.1:5002");
        console.log("response", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSend = async () => {
    if (userQuestion) {
      setLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:5002/api/chat", {
          userQuestion,
        });
        console.log(response);
        const message = { author: "You", content: userQuestion };
        const aiResponse = {
          author: "CodeCatalysts",
          content: response.data.content,
        };
        setChatHistory([...chatHistory, message, aiResponse]);
        setUserQuestion("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[100vh] bg-gray-800 text-gray-300">
      <div className="flex-1 flex">
        <Sidebar
          model={model}
          setModel={setModel}
          conversationalMemoryLength={conversationalMemoryLength}
          setConversationalMemoryLength={setConversationalMemoryLength}
        />
        <div className="flex-1 flex flex-col">
          <h1
            onClick={() => window.location.reload()}
            className="text-3xl poppins p-5 px-5 cursor-pointer font-semibold text-white"
          >
            CodeCatalyst
          </h1>
          <div className="flex-1 flex flex-col">
            <ChatArea
              chatHistory={chatHistory}
              loading={loading}
              setUserQuestion={setUserQuestion}
              handleSend={handleSend}
            />
          </div>
          <MessageInput
            userQuestion={userQuestion}
            setUserQuestion={setUserQuestion}
            handleSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;