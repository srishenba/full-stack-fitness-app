import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, User, Sparkles, Activity, Zap, 
  AlertCircle, CheckCircle2, Brain, ChevronRight
} from 'lucide-react';
import api from '../services/api';

const AICoach = () => {
  const [viewMode, setViewMode] = useState('analysis');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "SYSTEM ONLINE. Welcome to Meal Move AI. I've analyzed your latest data. How can I help you optimize further?",
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // 🔥 ONLY CHANGED PARTS SHOWN (copy carefully)

const fetchAnalysis = useCallback(async () => {
  console.log("🔥 fetchAnalysis called"); // ADD THIS

  setLoading(true);
  setError(null);
  try {
    const { data } = await api.post('/api/user/ai-analysis', {
      steps: 4500,
      calories: 1800,
      sleep: 6
    });

    console.log("✅ API RESPONSE:", data); // ADD THIS

    setAnalysis(data);
  } catch (err) {
    console.error("❌ ERROR:", err); // ADD THIS
    setError(err.response?.data?.message || 'AI error');
  } finally {
    setLoading(false);
  }
}, []);
// 🔥 ADD HERE
useEffect(() => {
  console.log("🚀 useEffect running");
  fetchAnalysis();
}, []);

  // ✅ Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, viewMode]);

  // ✅ REAL AI CHAT (Backend Connected)
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/api/ai/chat', {
  message: userMessage,
});

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || "No response from AI",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "⚠️ AI server not responding. Check backend.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input]);

  // ✅ Reusable section
  const AnalysisSection = ({ title, icon: Icon, items, colorClass }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-black uppercase text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items?.map((item, i) => (
          <li key={i} className="text-xs text-slate-400">
            • {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Brain className="text-teal-400 animate-pulse" size={50} />
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
          <p className="text-white">{error}</p>
          <button onClick={fetchAnalysis} className="mt-4 bg-teal-600 px-4 py-2 rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">AI COACH</h2>
          <div>
            <button onClick={() => setViewMode('analysis')} className="mr-2">Analysis</button>
            <button onClick={() => setViewMode('chat')}>Chat</button>
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ANALYSIS */}
          {viewMode === 'analysis' ? (
            <motion.div key="analysis">
              <h3 className="mb-4">{analysis?.summary}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <AnalysisSection title="Insights" icon={Brain} items={analysis?.keyInsights} />
                <AnalysisSection title="Recommendations" icon={Zap} items={analysis?.recommendations} />
                <AnalysisSection title="Daily Plan" icon={CheckCircle2} items={analysis?.dailyPlan} />
              </div>

              <button 
                onClick={() => setViewMode('chat')}
                className="mt-6 bg-teal-600 px-4 py-2 rounded"
              >
                Go to Chat <ChevronRight size={16} />
              </button>
            </motion.div>
          ) : (

            /* CHAT */
            <motion.div key="chat" className="flex flex-col h-[70vh]">

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-xs ${
                      msg.role === 'user' ? 'bg-teal-600' : 'bg-gray-800'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && <p className="text-gray-400">AI typing...</p>}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-3 rounded bg-gray-900"
                  placeholder="Ask AI..."
                />
                <button onClick={handleSend} className="bg-teal-600 px-4 rounded">
                  <Send size={18} />
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICoach;