"use client";

import { useState, useRef } from "react";

import {
  Search,
  Filter,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    message: "Magkano po ang Vendo Water?",
    time: "2m",
    active: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    message: "Saan po kayo located?",
    time: "15m",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    message: "Pwede po ba delivery?",
    time: "35m",
  },
  {
    id: 4,
    name: "Ana Cruz",
    message: "Salamat po!",
    time: "1h",
  },
];

export default function InboxPage() {
  const [search, setSearch] = useState("");

  const addEmoji = () => {
    setMessage((prev) => prev + "😊");
  };

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        text: message,
        sender: "ai",
      },
    ]);

    setMessage("");
  };

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      text: "Magkano po ang Vendo Water?",
      sender: "customer",
    },
    {
      text: "Ang presyo po ng Vendo Water ay ₱25.00 kada container.",
      sender: "ai",
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const filteredConversations = conversations.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.message.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-96 bg-white border-r">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-black">Conversations</h2>

            <Filter size={18} />
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 ${
                chat.active ? "bg-green-50" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
                {chat.name[0]}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-black">{chat.name}</h3>

                <p className="text-sm text-black truncate">{chat.message}</p>
              </div>

              {/* Time kung anong oras nag chat */}
              <span className="text-xs text-black">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-green-500 text-black flex items-center justify-center font-bold">
              J
            </div>

            <div>
              <h3 className="font-semibold text-black">Juan Dela Cruz</h3>

              <p className="text-sm text-green-500">Active now</p>
            </div>
          </div>

          <div className="flex gap-4 text-gray-500">
            <Phone size={20} />
            <Video size={20} />
            <MoreVertical size={20} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "ai" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm max-w-sm ${
                    msg.sender === "ai"
                      ? "bg-green-500 text-black"
                      : "bg-white text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4 text-gray-700">
          {selectedFile && (
            <div className="mb-3 flex items-center justify-between bg-gray-100 border rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-black">
                  📎 {selectedFile.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button onClick={handleAttachment}>
              <Paperclip size={20} className="text-black" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button onClick={addEmoji}>
              <Smile size={20} className="text-black" />
            </button>

            <button
              onClick={handleSend}
              className="bg-green-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
