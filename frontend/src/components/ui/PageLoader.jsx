import React from 'react';

export default function PageLoader({ message = 'LOADING CORE_OS...' }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-black text-teal-500 animate-pulse tracking-widest">
      {message}
    </div>
  );
}
