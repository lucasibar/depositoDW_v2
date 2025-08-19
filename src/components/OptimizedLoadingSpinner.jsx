import React from 'react';

const OptimizedLoadingSpinner = ({ 
  isLoading, 
  message = "Cargando...", 
  size = "medium",
  showProgress = false,
  progress = 0 
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      
      {message && (
        <p className="mt-2 text-sm text-gray-600 text-center">
          {message}
        </p>
      )}
      
      {showProgress && (
        <div className="w-full max-w-xs mt-2">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default OptimizedLoadingSpinner;
