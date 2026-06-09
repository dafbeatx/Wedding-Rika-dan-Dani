'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface InvitationCoverProps {
  guestName: string;
  slug: string;
}

export default function InvitationCover({ guestName, slug }: InvitationCoverProps) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpening(true);
    
    // Trigger celebratory confetti
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#1e3a5f', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#1e3a5f', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Set storage to flag that user has interacted (helps bypass browser autoplay restrictions for audio)
    sessionStorage.setItem('invitation_opened', 'true');

    // Smooth transition
    setTimeout(() => {
      router.push(`/invitation/${slug}/buka`);
    }, 1200);
  };

  // Framer Motion Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.8 } 
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.94,
      y: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutQuint for luxury smooth feel
        when: "beforeChildren",
        staggerChildren: 0.12,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate={isOpening ? { opacity: 0, scale: 1.05, transition: { duration: 1, ease: 'easeInOut' } } : "visible"}
      variants={backdropVariants}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 30, 95, 0.45) 0%, rgba(10, 19, 36, 0.75) 100%), url('/gallery/gallery4.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Preload background music to eliminate delay when opening the invitation */}
      <audio src="/marry-your-daughter_v3.mp3" preload="auto" className="hidden" />
      {/* Animated Glowing Gold Border and Accent Elements */}
      <div className="absolute inset-4 border border-gold-accent/20 pointer-events-none rounded-lg z-10" />
      <div className="absolute inset-6 border border-gold-accent/5 pointer-events-none rounded-lg z-10" />

      {/* Floating Sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/3 right-1/4 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full bottom-1/4 right-1/3 animate-ping" style={{ animationDuration: '5s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full bottom-1/3 left-1/5 animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      {/* Content Card (Cream / Off-white, Gold Border, Soft Deep Shadow) */}
      <motion.div 
        variants={cardVariants}
        className="relative w-full max-w-lg mx-4 px-8 py-16 md:px-12 md:py-20 text-center bg-[#FAF7F2] rounded-3xl shadow-[0_25px_60px_rgba(10,19,36,0.25)] border border-gold-accent/40 flex flex-col items-center justify-between min-h-[560px] z-20 overflow-hidden"
      >
        {/* Subtle Wedding Pattern texture overlay on the card */}
        <div className="absolute inset-0 bg-wedding-pattern opacity-[0.04] pointer-events-none" />

        {/* Elegant Gold Corner Ornaments inside the card */}
        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-40 bg-[url('/decor/corner.png')] bg-no-repeat bg-contain rotate-0" />
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-40 bg-[url('/decor/corner.png')] bg-no-repeat bg-contain scale-x-[-1]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-40 bg-[url('/decor/corner.png')] bg-no-repeat bg-contain scale-y-[-1]" />
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-40 bg-[url('/decor/corner.png')] bg-no-repeat bg-contain scale-[-1]" />

        {/* Top Header Section (Walimatul 'Ursy with Diamond Ornament) */}
        <motion.div variants={itemVariants} className="space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-gold-accent text-xs">✦</span>
            <span className="text-gold-accent text-[8px] opacity-70">♦</span>
            <span className="text-gold-accent text-xs">✦</span>
          </div>
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-gold-accent font-bold">
            Walimatul 'Ursy
          </p>
          <div className="w-16 h-[0.5px] bg-gold-accent/30 mx-auto" />
        </motion.div>

        {/* Main Names with Decorative Gold Lines */}
        <motion.div variants={itemVariants} className="my-6 space-y-5 relative z-10 w-full">
          {/* Top Gold Line Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent w-16" />
            <span className="text-gold-accent text-[8px] opacity-60">♦</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent w-16" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-light text-navy-dark tracking-wide py-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            Dani & Rika
          </h1>
          
          {/* Bottom Gold Line Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent w-16" />
            <span className="text-gold-accent text-[8px] opacity-60">♦</span>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent w-16" />
          </div>
          
          <p className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-gold-accent font-bold uppercase mt-2">
            AHAD, 14 JUNI 2026
          </p>
        </motion.div>

        {/* Guest Greeting Section (Prominent Guest Name) */}
        <motion.div variants={itemVariants} className="w-full max-w-sm py-4 space-y-3 relative z-10">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <div className="w-8 h-[0.5px] bg-gold-accent/30 mx-auto" />
          
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-navy-dark px-2 line-clamp-2 leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {guestName}
          </h2>
          
          <div className="w-8 h-[0.5px] bg-gold-accent/30 mx-auto" />
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed italic">
            *Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda untuk Hadir di Hari Bahagia Kami.
          </p>
        </motion.div>

        {/* Action Button (Navy Blue, Gold Border, Pill shape) */}
        <motion.div variants={itemVariants} className="mt-8 relative z-10">
          <button
            id="btn-open-invitation"
            onClick={handleOpenInvitation}
            className="group relative flex items-center gap-2.5 px-9 py-3.5 bg-navy-blue hover:bg-navy-dark text-white font-medium rounded-full border border-gold-accent shadow-md hover:shadow-navy-blue/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-sans text-xs uppercase tracking-widest overflow-hidden"
          >
            {/* Pulsing gold-colored ring overlay */}
            <span className="absolute inset-0 rounded-full border border-gold-accent animate-ping opacity-60 group-hover:hidden" />
            
            <MailOpen className="w-4 h-4 transition-transform group-hover:rotate-12 text-gold-accent" />
            <span>Buka Undangan</span>
          </button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

