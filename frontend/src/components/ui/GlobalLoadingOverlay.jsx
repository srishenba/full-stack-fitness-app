import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoading } from '../../context/LoadingContext';

export default function GlobalLoadingOverlay() {
  const { active } = useLoading();
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-wait"
      aria-hidden="true"
    >
      <Loader2 className="animate-spin text-teal-500" size={40} aria-label="Loading" />
    </div>
  );
}
