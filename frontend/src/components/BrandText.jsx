import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium wordmark: Sora (MEAL) + Orbitron (MOVE), gradient & neon glow.
 */
const BrandText = ({ size = 'text-xl', className = '', compact = false }) => {
  return (
    <div className={`relative inline-flex max-w-full items-center ${className}`}>
      <span
        className="pointer-events-none absolute -inset-1 rounded-lg bg-teal-500/25 opacity-70 blur-lg md:blur-xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -inset-0.5 rounded-md bg-gradient-to-r from-teal-500/40 via-cyan-400/30 to-teal-500/40 opacity-50 blur-sm"
        aria-hidden
      />

      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative inline-flex items-baseline gap-1.5 ${size} tracking-tight`}
      >
        <span
          className={`font-sans font-extrabold uppercase text-white ${
            compact ? 'tracking-[0.12em]' : 'tracking-tight'
          } drop-shadow-[0_0_14px_rgba(255,255,255,0.12)]`}
          style={{ textShadow: '0 0 24px rgba(20, 184, 166, 0.25)' }}
        >
          Meal
        </span>
        <span className="relative font-display font-bold uppercase">
          <span
            className="relative z-10 bg-gradient-to-r from-teal-200 via-cyan-300 to-teal-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift"
            style={{
              filter:
                'drop-shadow(0 0 10px rgba(45, 212, 191, 0.65)) drop-shadow(0 0 28px rgba(20, 184, 166, 0.45))',
            }}
          >
            Move
          </span>
        </span>
      </motion.span>
    </div>
  );
};

export default React.memo(BrandText);
