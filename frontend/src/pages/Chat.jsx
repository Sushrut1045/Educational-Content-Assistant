import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const Chat = () => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('eduassist_chat');
        return saved ? JSON.parse(saved) : [
            { role: 'bot', content: "Hello! I'm your AI education assistant. Ask me anything about your uploaded documents." }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('eduassist_chat', JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Real API call
            const response = await axios.post('https://educational-content-assistant-94xd.onrender.com/query', { question: input });
            const botMessage = { role: 'bot', content: response.data.answer };

            setMessages(prev => [...prev, botMessage]);
            setLoading(false);

        } catch (error) {
            console.error("Chat failed", error);
            const errorMessage = error.response?.data?.detail || "Sorry, I encountered an error answering your question. Please ensure the backend is running.";
            setMessages(prev => [...prev, { role: 'bot', content: `Error: ${errorMessage}` }]);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-100 text-primary" : "bg-green-100 text-green-600")}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={clsx("p-4 rounded-lg max-w-[80%]", msg.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none")}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><Bot className="w-5 h-5" /></div>
                        <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none text-gray-500 italic flex items-center gap-2">
                            Thinking... <Loader className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Chat History</span>
                <button
                    onClick={() => { setMessages([{ role: 'bot', content: "History cleared. Ask me anything!" }]); localStorage.removeItem('eduassist_chat'); }}
                    className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                    type="button"
                >
                    Clear Chat
                </button>
            </div>
            <form onSubmit={handleSend} className="flex gap-2 p-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your documents..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-primary text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
