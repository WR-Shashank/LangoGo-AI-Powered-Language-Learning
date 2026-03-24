import React, { useState, useEffect, useRef } from 'react';
import useAgent from '../hooks/useAgent';

const LangoAgentPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Get utilities from our custom hook
  const { agentCall, isPending } = useAgent();

  // Auto-scroll to bottom whenever messages change or AI starts thinking
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;

    // 1. Instantly add User Message to UI
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      // 2. Await the actual response from the backend
      // We send the object expected by your agentApi
      const response = await agentCall(userMsg);

      // 3. Add the AI response to the chat list
      // Note: Adjust 'response.text' based on your exact backend JSON structure
      const aiMsg = { 
        id: Date.now() + 1, 
        text: response.text || response.message || "I processed your request.", 
        sender: 'ai' 
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      // Optional: Add an error message bubble to the chat
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        text: "Sorry, I'm having trouble connecting to the server.", 
        sender: 'ai' 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-primary p-4 text-white font-bold text-center shadow-md">
          LangoGo AI Agent
        </div>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* AI Thinking Indicator (Driven by TanStack isPending) */}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-tl-none italic text-sm animate-pulse">
                AI is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LangoGo anything..."
            disabled={isPending}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <button 
            type="submit"
            disabled={isPending || !input.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all font-medium disabled:bg-gray-400"
          >
            {isPending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LangoAgentPage;