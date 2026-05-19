import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am the e-Panchayat Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, isBot: false }]);

    // Simulate bot thinking and API call
    try{
      const token=localStorage.getItem("token");
      const response= await axios.post("http://127.0.0.1:8000/chatbot/chat",{
        message:userMessage
      },{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }

    );
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: response.data.response,
        isBot: true
      }
    ]);

    }catch(error){
          console.error(error);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: "Unable to connect to chatbot server.",
        isBot: true
      }
    ]);
  }
    };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:-translate-y-1 hover:bg-primary-light transition-all z-[9999] ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open Chatbot"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999] transition-all transform origin-bottom-right duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-bold">e-Panchayat Helpdesk</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-primary-100 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages Output */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.isBot 
                ? 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm' 
                : 'bg-primary text-white self-end rounded-tr-none shadow-md'
            }`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full px-4 py-2 text-sm outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
