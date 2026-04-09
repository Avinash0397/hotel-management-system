import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaTimes, FaSpa } from "react-icons/fa";

const CHAT_OPTIONS = [
  {
    id: "booking",
    text: "How do I book a room?",
    reply: "To book a room, log in to your account, browse our Hotels page, select a hotel, pick an available room, and click 'Book Now'. The process is quick and secure!"
  },
  {
    id: "policies",
    text: "What are your check-in policies?",
    reply: "Our standard check-in time is 2:00 PM, and check-out is by 11:00 AM. Please bring a valid government-issued photo ID upon arrival."
  },
  {
    id: "amenities",
    text: "What amenities do you offer?",
    reply: "Our luxury properties offer world-class amenities including high-speed WiFi, spas, gymnasiums, swimming pools, and fine-dining restaurants. Be sure to check exactly what's offered on each hotel's dedicated page!"
  },
  {
    id: "support",
    text: "How can I contact support?",
    reply: "Our elite concierge service is available 24/7. Reach out to us at support@cloudnexus.com or call our toll-free luxury line at +1-800-LUXURY for immediate assistance."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to our luxury collection. How may our digital concierge assist you today?" }
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleOptionClick = (option) => {
    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: option.text }]);
    
    // Simulate thinking delay then add bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: option.reply }]);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 luxury-card rounded-2xl overflow-hidden z-50 flex flex-col border border-[#C9A84C]/30 shadow-2xl shadow-black h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-[#111318] p-4 border-b border-[#C9A84C]/20 flex justify-between items-center bg-gradient-to-r from-[#111318] to-[#1a1c23]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8C97A] to-[#9A7A2E] flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.5)]">
                  <FaSpa className="text-[#0D1117] text-lg" />
                </div>
                <div>
                  <h3 className="font-serif text-[#C9A84C] font-semibold tracking-wide">Digital Concierge</h3>
                  <p className="text-[10px] text-[#E8E0D0]/50 tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#E8E0D0]/50 hover:text-[#C9A84C] transition-colors p-2"
              >
                <FaTimes />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-[#0D1117]/90 space-y-4">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-br from-[#E8C97A] to-[#C9A84C] text-[#0D1117] rounded-br-sm" 
                        : "bg-[#111318] text-[#E8E0D0] border border-[#C9A84C]/20 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Options Panel */}
            <div className="p-4 bg-[#111318] border-t border-[#C9A84C]/10">
              <p className="text-[10px] text-[#E8E0D0]/40 tracking-widest uppercase mb-3 text-center">Suggested Inquiries</p>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[140px] pr-1 styled-scrollbar">
                {CHAT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="text-left w-full p-3 rounded-xl border border-[#C9A84C]/30 bg-[#0D1117]/50 text-[#C9A84C] text-xs hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] z-50 transition-colors ${
          isOpen ? "bg-[#111318] border border-[#C9A84C] text-[#C9A84C]" : "bg-gradient-to-br from-[#E8C97A] to-[#9A7A2E] text-[#0D1117]"
        }`}
      >
        {isOpen ? <FaTimes size={20} /> : <FaComments size={24} />}
      </motion.button>
    </>
  );
}
