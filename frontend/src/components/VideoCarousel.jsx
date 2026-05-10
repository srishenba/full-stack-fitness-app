import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import video1 from '../assets/video.1.mp4';
import video2 from '../assets/video.2.mp4';
import video3 from '../assets/video.3.mp4';
import video4 from '../assets/video.4.mp4';
import './VideoCarousel.css';

const videos = [
  { id: 1, src: video1, title: 'Nourish Your Body' },
  { id: 2, src: video2, title: 'Energizing Freshness' },
  { id: 3, src: video3, title: 'Precision Prep' },
  { id: 4, src: video4, title: 'Healthy Lifestyle' },
];

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log('Autoplay issue', e));
    }
  }, [currentIndex]);

  return (
    <div
      className="ag-video-carousel-container"
      onClick={nextVideo}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="ag-video-wrapper"
        >
          <video
            ref={videoRef}
            src={videos[currentIndex].src}
            className="ag-video-element"
            muted
            playsInline
            onEnded={nextVideo}
            autoPlay
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay Content */}
      <div className="ag-video-overlay">
        <motion.h2
          key={`title-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="ag-video-title"
        >
          {videos[currentIndex].title}
        </motion.h2>
        <p className="ag-video-subtitle">Click anywhere to skip</p>
      </div>

      {/* Dots Indicator */}
      <div className="ag-video-dots">
        {videos.map((_, idx) => (
          <div
            key={idx}
            className={`ag-video-dot ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
