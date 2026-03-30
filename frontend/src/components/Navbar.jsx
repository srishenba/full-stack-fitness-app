import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = searchValue.toLowerCase().trim();
      if (value === "login") {
        navigate("/login");
      } else if (value === "signup" || value === "register") {
        navigate("/signup");
      } else if (value === "dashboard") {
        navigate("/dashboard");
      } else if (value === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (value === "features") {
        const section = document.getElementById("features");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } else if (value !== "") {
        alert("Page not found");
      }
      setIsSearchVisible(false);
      setSearchValue("");
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // Small timeout to allow input to render before focusing if we were to use a ref
      // But for now just toggle state
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-teal-600/90 to-green-500/90 backdrop-blur-md shadow-sm transition-all duration-300 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo fully visible, horizontally aligned, minimal sizing */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img
              src={logo}
              alt="Meal Move Logo"
              className="h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Meal <span className="text-green-400 group-hover:text-green-300 transition-colors">Move</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* AI Link */}
            <div 
              onClick={() => {
                const section = document.getElementById('ai-section');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative flex items-center gap-2 cursor-pointer px-3 py-2 rounded-full transition-all duration-300 group"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-green-500/10 blur-md opacity-0 group-hover:opacity-100 transition duration-300 rounded-full"></div>

              {/* Icon */}
              <Brain
                size={18}
                className="text-white group-hover:text-green-400 transition duration-300"
              />

              {/* Text */}
              <span className="text-white font-semibold group-hover:text-green-400 transition duration-300">
                AI
              </span>

              {/* NEW badge */}
              <span className="absolute -top-1 -right-2 text-[8px] bg-green-500 text-black px-1.5 py-[1px] rounded-full font-bold tracking-wider shadow animate-pulse">
                NEW
              </span>
            </div>

            {/* Icons & Buttons */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center relative">
                <AnimatePresence>
                  {isSearchVisible && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search (e.g., login, dashboard)"
                      className="bg-white/10 border border-white/20 text-white text-[10px] rounded-full px-4 py-1.5 focus:outline-none focus:border-white/40 placeholder:text-white/40 mr-2"
                      autoFocus
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={toggleSearch}
                  className="text-white/90 hover:text-teal-900 transition-colors cursor-pointer p-1"
                >
                  <Search size={16} />
                </button>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="text-white/90 hover:text-teal-900 font-medium text-xs rounded transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white/10 text-white/90 font-medium tracking-wide text-xs px-3 py-1.5 rounded hover:bg-white/20 hover:text-teal-900 transition-colors border border-white/10"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="flex items-center relative">
              <AnimatePresence>
                {isSearchVisible && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search..."
                    className="bg-white/10 border border-white/20 text-white text-[10px] rounded-full px-3 py-1 focus:outline-none focus:border-white/40 placeholder:text-white/40 mr-2"
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button
                onClick={toggleSearch}
                className="text-white/90 hover:text-teal-900 p-1 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
            <button
              className="text-white/90 hover:text-teal-900 p-1 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute w-full bg-teal-800/95 backdrop-blur-xl border-t border-black/10 overflow-hidden shadow-sm z-40"
          >
            <div className="flex flex-col items-center py-4 space-y-2 px-4">
              <button
                onClick={() => {
                  const section = document.getElementById('ai-section');
                  section?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="w-full max-w-xs relative flex items-center justify-center gap-2 text-white font-black text-xs uppercase py-3 hover:text-green-400 hover:bg-white/10 transition-all rounded border border-transparent hover:border-green-400/20 group"
              >
                <Brain size={18} className="text-white group-hover:text-green-400 transition-colors" />
                <span>AI Assistant</span>
                <span className="absolute top-2 right-4 text-[7px] bg-green-500 text-black px-1.5 py-[1px] rounded-full font-bold shadow animate-pulse">
                  NEW
                </span>
              </button>
              <button
                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                className="w-full max-w-xs text-center text-white/90 font-medium text-xs uppercase py-3 hover:text-teal-900 hover:bg-white/10 transition-colors rounded"
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                className="w-full max-w-xs text-center bg-white/10 text-white/90 font-medium text-xs uppercase py-3 hover:text-teal-900 hover:bg-white/20 transition-colors border border-white/10 rounded"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
