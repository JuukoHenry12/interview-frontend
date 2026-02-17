'use client';
import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";

const ChatUI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/public-products/chat/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );
      const data = await res.json();
      const aiMessage = { id: Date.now() + 1, role: "assistant", content: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "Server error." },
      ]);
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") sendMessage(); };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 z-50"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 font-semibold flex justify-between items-center">
            AI Assistant
            <button onClick={toggleChat} className="font-bold">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`px-3 py-2 rounded-2xl max-w-xs break-words ${
                  msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-3 border-t gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatUI;
