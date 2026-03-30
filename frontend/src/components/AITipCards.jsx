import React from 'react';
import { motion } from 'framer-motion';
import './AITipCards.css';

const AITipCards = ({ tips, isLoading = false }) => {
  // Default tips if none provided
  const displayTips = tips || [
    {
      icon: '💧',
      title: 'Hydrate First',
      tip: 'Drink two warm glasses of water before your morning chai to wake up your body and boost digestion instantly.'
    },
    {
      icon: '🥗',
      title: 'Colorful Thali',
      tip: 'Fill half your plate with vibrant sabzi to secure essential vitamins for daily fitness and glowing health.'
    },
    {
      icon: '🍗',
      title: 'Protein Power',
      tip: 'Pack protein into every meal! Choose paneer, dal, or eggs to keep your muscles strong and energized.'
    }
  ];

  if (isLoading) {
    return (
      <div className="ag-tips-grid">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div className="ag-tip-card-wrapper skeleton" key={`skel-${idx}`}>
            <div className="ag-tip-card-glass" style={{ opacity: 0.6 }}>
              <div className="ag-skeleton-icon"></div>
              <div className="ag-skeleton-title"></div>
              <div className="ag-skeleton-line"></div>
              <div className="ag-skeleton-line short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ag-tips-grid">
      {displayTips.map((item, index) => (
        <motion.div 
          className="ag-tip-card-wrapper"
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
        >
          {/* subtle gradient border wrapper */}
          <div className="ag-tip-card-glass">
            <div className="ag-tip-card-icon">{item.icon}</div>
            <h3 className="ag-tip-card-title">{item.title}</h3>
            <p className="ag-tip-card-text">{item.tip}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AITipCards;
