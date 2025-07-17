import React from 'react';
import { cn } from '@/lib/utils';

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-8 h-8 text-primary/50', className)}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

const FloatingIcons = () => {
  return (
    <div className="hidden lg:block">
      {/* Left Icon */}
      <div
        className="fixed top-1/4 left-8 animate-[float-up-down_4s_ease-in-out_infinite]"
        style={{ animationDelay: '0s' }}
      >
        <SparkleIcon />
      </div>
      {/* Right Icon */}
      <div
        className="fixed top-1/2 right-8 animate-[float-up-down_4s_ease-in-out_infinite]"
        style={{ animationDelay: '1s' }}
      >
        <SparkleIcon />
      </div>
       {/* More Icons */}
       <div
        className="fixed top-3/4 left-16 animate-[float-up-down_5s_ease-in-out_infinite]"
        style={{ animationDelay: '0.5s' }}
      >
        <SparkleIcon className="w-6 h-6 text-primary/30" />
      </div>
       <div
        className="fixed bottom-1/4 right-16 animate-[float-up-down_5s_ease-in-out_infinite]"
        style={{ animationDelay: '1.5s' }}
      >
        <SparkleIcon className="w-6 h-6 text-primary/30" />
      </div>
    </div>
  );
};

export default FloatingIcons;
