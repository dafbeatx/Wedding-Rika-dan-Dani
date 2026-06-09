'use client';

import React, { useState, useEffect } from 'react';
import { Home, Users, Calendar, Image as ImageIcon, Gift, MessageSquare } from 'lucide-react';

export default function BottomNavigation() {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'mempelai', label: 'Mempelai', icon: Users },
    { id: 'acara', label: 'Acara', icon: Calendar },
    { id: 'galeri', label: 'Galeri', icon: ImageIcon },
    { id: 'amplop', label: 'Kado', icon: Gift },
    { id: 'ucapan', label: 'Ucapan', icon: MessageSquare },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md md:hidden">
      <div className="bg-[#FAF7F2]/90 backdrop-blur-md border border-gold-accent/25 rounded-full px-4 py-2.5 shadow-[0_10px_30px_rgba(10,19,36,0.15)] flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 relative focus:outline-none"
            >
              <Icon 
                className={`w-4.5 h-4.5 transition-transform duration-300 ${
                  isActive ? 'text-gold-accent scale-110' : 'text-slate-400 hover:text-slate-600'
                }`} 
              />
              <span 
                className={`text-[8px] md:text-[9px] mt-1 font-sans tracking-wide transition-all duration-300 ${
                  isActive ? 'text-gold-accent font-semibold scale-105' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-gold-accent rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
