'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type AnimationType = 'fade-up' | 'fade-in' | 'scale-up' | 'fade-left' | 'fade-right';

interface ScrollAnimateProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollAnimate({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 0.8,
  className = '',
}: ScrollAnimateProps) {
  const getVariants = () => {
    switch (type) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-in':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'scale-up':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.02, 0.43, 1.01], // Custom premium ease-out curve
      }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
