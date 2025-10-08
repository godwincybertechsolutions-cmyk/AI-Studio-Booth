import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div 
      className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden shadow-inner"
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${clampedProgress}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference pointer-events-none">
        {Math.round(clampedProgress)}%
      </span>
    </div>
  );
};

export default React.memo(ProgressBar);