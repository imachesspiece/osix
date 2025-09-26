import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, number> = {
  sm: 18,
  md: 26,
  lg: 38,
};

interface LoadingSpinnerProps {
  text?: string;
  size?: SpinnerSize;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading…', size = 'md' }) => {
  const dimension = sizeMap[size];

  return (
    <div className="flex items-center gap-3 text-slate-300" role="status" aria-live="polite">
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 50 50"
        className="animate-spin text-sky-400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="31.415, 31.415"
        />
      </svg>
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
