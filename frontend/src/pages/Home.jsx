import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Utensils, Activity, Brain, LineChart, UserPlus, FileText, Dumbbell, Sparkles, Instagram, Twitter, Github, Mail, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';

// Import local assets
import video1 from '../assets/video.1.mp4';
import video2 from '../assets/video.2.mp4';
import video3 from '../assets/video.3.mp4';
import video4 from '../assets/video.4.mp4';
import dashboardPreview from '../assets/dashboard_preview.png';

const slides = [
  {
    id: 1,
    video: video1,
    title: "Fuel Your Body",
    subtitle: "Personalized nutrition plans for your lifestyle."
  },
  {
    id: 2,
    video: video2,
    title: "Push Your Limits",
    subtitle: "Custom workouts designed to break your plateaus."
  },
  {
    id: 3,
    video: video3,
    title: "Eat Clean",
    subtitle: "Delicious, chef-prepared meals for maximum performance."
  },
  {
    id: 4,
    video: video4,
    title: "Train Hard",
    subtitle: "Unlock your true potential with our elite coaches."
  }
];

const features = [
  {
    icon: <Utensils size={40} className="text-green-400 mb-4" />,
    title: "Smart Nutrition Tracking",
    description: "Track your daily meals and monitor calories with ease"
  },
  {
    icon: <Activity size={40} className="text-green-400 mb-4" />,
    title: "Activity Monitoring",
    description: "Record workouts and stay consistent with your fitness goals"
  },
  {
    icon: <Brain size={40} className="text-green-400 mb-4" />,
    title: "AI Recommendations",
    description: "Get personalized diet and workout suggestions powered by AI"
  },
  {
    icon: <LineChart size={40} className="text-green-400 mb-4" />,
    title: "Progress Analytics",
    description: "Visualize your progress with detailed insights and reports"
  }
];

const howItWorksSteps = [
  {
    icon: <UserPlus size={40} />,
    title: "Sign Up",
    description: "Create your account to get started"
  },
  {
    icon: <FileText size={40} />,
    title: "Enter Your Details",
    description: "Add your personal and fitness information"
  },
  {
    icon: <Dumbbell size={40} />,
    title: "Track Meals & Workouts",
    description: "Log your meals and daily activities بسهولة"
  },
  {
    icon: <Sparkles size={40} />,
    title: "Get AI Suggestions",
    description: "Receive personalized fitness and diet recommendations"
  }
];

const faqItems = [
  {
    question: "How does AI recommendation work?",
    answer: "Our AI analyzes your activity, goals, and preferences to suggest personalized meals and workouts"
  },
  {
    question: "Is this free to use?",
    answer: "Yes, the basic features are free to use with optional advanced features in future"
  },
  {
    question: "Can I track calories daily?",
    answer: "Yes, you can easily log and monitor your daily calorie intake"
  },
  {
    question: "Do I need prior fitness knowledge?",
    answer: "No, the platform is beginner-friendly and guides you step by step"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is handled securely and privately"
  }
];

const aiHighlights = [
  {
    icon: <Utensils size={40} />,
    title: "Meal Suggestions",
    description: "Receive intelligent meal recommendations based on your calorie needs and preferences"
  },
  {
    icon: <Dumbbell size={40} />,
    title: "Workout Recommendations",
    description: "Get AI-generated workout plans to improve strength, endurance, and consistency"
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);

  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [blinkingCard, setBlinkingCard] = useState(null);

  const handleFeatureClick = (index) => {
    setBlinkingCard(index);
    setTimeout(() => setBlinkingCard(null), 400);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const askAI = async () => {
    if (!aiInput.trim()) return;

    setLoading(true);
    setAiResponse("");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
      setAiResponse("API Key is missing. Please update your .env file.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: aiInput }]
              }
            ]
          })
        }
      );

      const data = await res.json();
      console.log("Gemini API Response:", data);

      if (data.error) {
        setAiResponse(`API Error: ${data.error.message || "Unknown error"}`);
      } else {
        const output =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response from AI. The model might have blocked the input or output.";
        setAiResponse(output);
        setAiInput("");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setAiResponse("Something went wrong with the network request. Try again.");
    }

    setLoading(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    const video = videoRefs.current[currentSlide];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [currentSlide, isPlaying]);

  useEffect(() => {
    // Ensure the current video plays if isPlaying is true
    const video = videoRefs.current[currentSlide];
    if (video && isPlaying) {
      video.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentSlide, isPlaying]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black font-sans">
      <Navbar />

      {/* Hero Carousel */}
      <div className="relative h-screen w-full bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            {/* Background Video with slight zoom effect */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={(el) => (videoRefs.current[currentSlide] = el)}
                src={slides[currentSlide].video}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </motion.div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black/60 z-10" />

            {/* Center-Left Aligned Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 pt-20 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="max-w-3xl"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl mb-6">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-2xl text-gray-200 font-medium drop-shadow-xl mb-10 max-w-xl">
                  {slides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to="/signup">
                    <button className="group relative bg-green-500 text-black font-black uppercase tracking-widest text-sm md:text-lg px-10 py-5 rounded-full overflow-hidden shadow-[0_10px_30px_rgba(34,197,94,0.4)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 w-full sm:w-auto">
                      <span className="relative z-10">Start Now</span>
                      <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 ease-out group-hover:scale-100 group-hover:bg-green-400 z-0"></div>
                    </button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <button className="group relative bg-transparent border-2 border-white/20 hover:border-green-500/50 text-white font-black uppercase tracking-widest text-sm md:text-lg px-10 py-5 rounded-full overflow-hidden transition-all duration-300 w-full">
                      <span className="relative z-10 group-hover:text-green-400 transition-colors">Sign In</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute z-30 left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/20 group cursor-pointer"
        >
          <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute z-30 right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/20 group cursor-pointer"
        >
          <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${index === currentSlide ? 'w-12 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full py-24 bg-black relative z-10 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Our Features</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Everything you need to track your fitness and nutrition</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleFeatureClick(index)}
              className={`bg-white/5 backdrop-blur-md rounded-[16px] p-[24px] flex flex-col items-center text-center border border-white/10 hover:scale-105 hover:shadow-[0_15px_30px_rgba(34,197,94,0.15)] transition-all duration-300 ease-out cursor-pointer ${blinkingCard === index ? 'active-blink' : ''}`}
            >
              {feature.icon}
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full py-24 bg-black relative z-10 px-6 md:px-12 lg:px-24 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Follow these simple steps to start your fitness journey</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 relative w-full max-w-7xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-1 w-full max-w-sm flex flex-col items-center text-center bg-white/5 backdrop-blur-md rounded-[16px] p-[20px] border border-white/10 hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="text-green-400 mb-4">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-green-500 text-black font-black flex items-center justify-center text-sm mb-4 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>

              {/* Arrow connectors */}
              {index < howItWorksSteps.length - 1 && (
                <div className="text-green-500/50 flex items-center justify-center">
                  <svg className="hidden md:block w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <svg className="block md:hidden w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="w-full py-24 bg-black relative z-10 px-6 md:px-12 lg:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col text-left"
          >
            <h2 className="text-xl md:text-2xl font-black text-green-400 uppercase tracking-widest mb-4">Dashboard Preview</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-tight">Monitor everything in one place</h3>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Track your calories, workouts, and progress with an intuitive and easy-to-use dashboard.
            </p>
          </motion.div>

          {/* Right Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group bg-zinc-900"
          >
            <div className="overflow-hidden rounded-[16px]">
              <motion.img
                src={dashboardPreview}
                alt="Dashboard Preview"
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* AI Highlight Section */}
      <div className="w-full py-24 bg-black relative z-10 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
            AI-Powered Fitness Intelligence
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Powered by AI for personalized health insights
          </h3>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get smarter meal plans and workout recommendations tailored to your goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
          {aiHighlights.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-md rounded-[16px] p-[24px] flex flex-col items-center text-center border border-white/10 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(34,197,94,0.2)] transition-all duration-300 relative group"
            >
              {/* Icon Container with glowing pulse effect */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 animate-pulse transition-opacity duration-300" />
                <div className="relative z-10 text-green-400 flex items-center justify-center bg-black/50 w-20 h-20 rounded-full border border-green-500/30">
                  {feature.icon}
                </div>
              </div>

              <h4 className="text-2xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Assistant Section */}
      <div id="ai-section" className="w-full py-24 bg-black relative z-10 px-6 border-t border-white/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 text-center">AI Assistant</h2>
          <p className="text-lg text-gray-400 mb-10 text-center mx-auto max-w-2xl">Ask anything about fitness, nutrition, and health</p>

          <div className="bg-white/5 backdrop-blur-md rounded-[16px] p-8 md:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl mx-auto overflow-hidden">
            <div className="flex flex-col gap-6">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask something (e.g., best diet for weight loss)"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white text-lg focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-500 text-center"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') askAI();
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={askAI}
                disabled={loading}
                className="bg-green-500 text-black font-black uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Thinking..." : "Ask AI"}
              </motion.button>

              <div className="mt-4 flex flex-col items-center">
                {loading && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 mt-4 animate-pulse"
                  >
                    AI is thinking...
                  </motion.p>
                )}

                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-6 rounded-xl bg-white/5 border border-white/10 w-full text-left"
                  >
                    <p className="text-green-400 whitespace-pre-wrap leading-relaxed">
                      {aiResponse}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Call To Action Section */}
      <div className="w-full py-32 bg-black relative z-10 px-6 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
            Start your fitness <span className="text-green-400">journey today</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards a healthier and smarter lifestyle with our AI-powered fitness solutions.
          </p>

          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34,197,94,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-black text-lg md:text-xl font-black uppercase tracking-widest px-12 py-5 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Subtle background glow for CTA */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* FAQ Section */}
      <div className="w-full py-24 bg-black relative z-10 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400">Find answers to common questions about our platform</p>
        </motion.div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-[16px] border border-white/10 overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all text-white focus:outline-none"
              >
                <span className="text-lg font-bold">{item.question}</span>
                <div className={`p-2 rounded-full ${activeFAQ === index ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400'} transition-all`}>
                  {activeFAQ === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-[#025043] border-t border-white/10 pt-20 pb-10 relative z-10 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Col 1: About */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Meal <span className="text-green-400">Move</span></h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              AI-powered fitness and nutrition tracking platform designed to help you stay healthy and consistent.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 border border-white/10 hover:text-green-400 hover:border-green-400/50 hover:scale-110 transition-all duration-300 ease-in-out">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 border border-white/10 hover:text-green-400 hover:border-green-400/50 hover:scale-110 transition-all duration-300 ease-in-out">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Home</Link></li>
              <li><a href="#features" className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Features</a></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Dashboard</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Sign Up</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Login</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-green-400" />
                <span className="text-sm md:text-base">mealmoveofficial26@gmail.com</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed italic">
                "Feel free to reach out for support or queries"
              </p>
            </div>
          </div>

          {/* Col 4: Resources */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform"><Github size={18} /> GitHub</a></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-all duration-300 ease-in-out text-sm md:text-base inline-block hover:translate-x-1 transform">Privacy Policy</Link></li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center px-4">
          <p className="text-gray-500 text-sm">
            © 2026 Meal Move. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;