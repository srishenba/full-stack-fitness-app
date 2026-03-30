import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User } from 'lucide-react';

const AICoach = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "SYSTEM ONLINE. Welcome to Meal Move AI. I'm your primary fitness coach. Status: Ready.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const nextInput = input.trim();
    const newMessages = [...messages, { role: 'user', content: nextInput }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      let response =
        "That sounds like a great move! Consistency is key to reaching your target weight. Would you like me to adjust your meal frequency today?";
      if (nextInput.toLowerCase().includes('water'))
        response =
          'Hydration logic active. For your body weight, aim for 3.5 liters today. Reminder set.';
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  }, [input, messages]);

  return (
    <div className="bg-black min-h-[calc(100vh-5rem)] text-slate-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-6 py-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Bot className="text-teal-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                AI COACH <span className="text-teal-500">PRIME</span>
              </h2>
              <div className="flex items-center gap-2 text-[9px] text-teal-500 font-bold uppercase tracking-[0.2em] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> Frequency Active
              </div>
            </div>
          </div>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar mb-10 pb-10 min-h-[40vh]"
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg
                      ${msg.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-teal-600/10 border-teal-500/30'}
                    `}
                  >
                    {msg.role === 'user' ? (
                      <User size={18} className="text-white" />
                    ) : (
                      <Bot size={18} className="text-teal-400" />
                    )}
                  </div>
                  <div
                    className={`px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed border
                      ${
                        msg.role === 'user'
                          ? 'bg-teal-600 text-white border-teal-500 shadow-[0_10px_20px_rgba(20,184,166,0.2)]'
                          : 'glass text-slate-300 border-teal-500/10'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        <div className="glass p-3 rounded-[2.5rem] border border-teal-500/10 flex items-center gap-4 mb-6 focus-within:border-teal-500/50 transition-all shadow-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about macros, calories, or training..."
            className="flex-1 bg-transparent px-6 py-4 text-sm font-bold focus:outline-none placeholder:text-slate-700"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isTyping}
            className="w-14 h-14 rounded-[1.5rem] bg-teal-600 text-white flex items-center justify-center hover:bg-teal-500 hover:scale-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(20,184,166,0.3)] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
    <div className="glass px-6 py-4 rounded-[2rem] border border-teal-500/10 flex gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce delay-150"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce delay-300"></span>
    </div>
  </motion.div>
);

export default React.memo(AICoach);
