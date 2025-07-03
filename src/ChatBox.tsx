import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi there! How can I help you?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: input,
            sender: "user"
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://primary-production-cab4.up.railway.app/webhook/ask",
                {
                    query: userMessage.text
                }
            );

            console.log(response);
            
            const responseData = response.data.data.replaceAll('\n', ' ').replaceAll('*', '').replaceAll('"', '');

            const botMessage: Message = {
                id: Date.now() + 1,
                text: responseData || "Sorry, I couldn't understand that.",
                sender: "bot"
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.log(error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    text: "There was an error connecting to the server.",
                    sender: "bot"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="w-full mx-auto h-full flex flex-col border border-gray-300 rounded shadow-md">
            <div className="flex items-center justify-between bg-[#0093D0] text-white px-5 py-3 rounded-t">
                <img src="/ust-white-logo.svg" alt="UST" />
                <h2 className="text-lg font-semibold">Ask anything about IBC's MedPolicy</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50 space-y-2">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-gray-400 text-sm italic">Bot is typing...</div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gray-300 p-3 flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Ask your question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="bg-white text-[#0093D0] px-4 py-2 rounded hover:bg-[#0093D0] hover:text-white transition"
                    onClick={handleSend}
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
