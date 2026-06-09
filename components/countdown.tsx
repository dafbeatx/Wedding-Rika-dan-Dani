'use client';

import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const targetDate = '2026-06-14T10:00:00+07:00'; // 14 June 2026 10.00 WIB
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      setTimeLeft(newTimeLeft);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-navy-dark/40 border border-gold-accent/10 rounded-xl p-3 text-center min-w-[70px]">
            <div className="h-8 bg-slate-700/50 rounded mb-1" />
            <div className="h-3 bg-slate-700/30 rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto">
      {items.map((item, index) => (
        <div
          key={index}
          className="glass-navy border border-gold-accent/25 rounded-xl p-3 text-center shadow-lg relative overflow-hidden group min-w-[70px] md:min-w-[80px]"
        >
          {/* Subtle hover background highlight */}
          <div className="absolute inset-0 bg-gold-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <span className="block font-sans text-2xl md:text-3xl font-extrabold text-gradient-gold">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="block text-[10px] md:text-xs text-slate-300 uppercase tracking-widest mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
