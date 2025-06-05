import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    React.createElement('div', { className: "flex flex-col items-center justify-center py-4" },
      React.createElement('div', {
        className: `animate-spin rounded-full ${sizeClasses[size]} border-condo-primary border-t-transparent`
      }),
      text && React.createElement('p', { className: "mt-2 text-sm text-condo-dark-text" }, text)
    )
  );
};
