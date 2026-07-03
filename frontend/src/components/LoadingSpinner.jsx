import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const LoadingSpinner = ({ fullScreen = false, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        className={clsx('rounded-full border-2 border-gold-800 border-t-gold-400', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {size === 'lg' && (
        <p className="text-silver-500 text-sm font-serif tracking-widest animate-pulse">SILVERKAARI</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-gold-800 border-t-gold-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="text-center">
            <p className="text-gold-400 font-serif text-xl tracking-[0.3em]">SILVERKAARI</p>
            <p className="text-silver-600 text-xs mt-1 tracking-widest">HANDCRAFTED WITH HERITAGE</p>
          </div>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
