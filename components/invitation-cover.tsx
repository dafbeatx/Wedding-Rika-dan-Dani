'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailOpen, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 19, 36, 0.8), rgba(10, 19, 36, 0.95)), url('/gallery/gallery1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Glowing Gold Border and Accent Elements */}
      <div className="absolute inset-4 border border-gold-accent/20 pointer-events-none rounded-lg z-10" />
      <div className="absolute inset-6 border border-gold-accent/10 pointer-events-none rounded-lg z-10 animate-pulse-slow" />

      {/* Floating Sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/3 right-1/4 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full bottom-1/4 right-1/3 animate-ping" style={{ animationDuration: '5s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full bottom-1/3 left-1/5 animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      {/* Content Card */}
      <div className="relative w-full max-w-lg px-6 py-12 mx-4 text-center glass-navy rounded-2xl shadow-2xl border border-gold-accent/30 flex flex-col items-center justify-between min-h-[500px] z-20 animate-fade-in-up">
        {/* Top Header */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-accent font-semibold">
            Walimatul 'Ursy
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto" />
        </div>

        {/* Main Names */}
        <div className="my-6 space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-gradient-gold tracking-wide">
            Dani & Rika
          </h1>
          <p className="font-sans text-sm tracking-[0.15em] text-slate-300">
            AHAD, 14 JUNI 2026
          </p>
        </div>

        {/* Guest Greeting Section */}
        <div className="w-full max-w-sm px-4 py-6 rounded-xl bg-navy-dark/60 border border-gold-accent/15 space-y-3">
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <h2 className="font-serif text-xl md:text-2xl font-medium text-slate-100 px-2 line-clamp-2">
            {guestName}
          </h2>
          <div className="w-8 h-[1px] bg-gold-accent/30 mx-auto" />
          <p className="text-[11px] text-slate-400 italic">
            *Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda untuk Hadir di Hari Bahagia Kami.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            id="btn-open-invitation"
            onClick={handleOpenInvitation}
            className="group relative flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-accent to-gold-hover hover:from-gold-hover hover:to-gold-accent text-navy-dark font-medium rounded-full shadow-lg hover:shadow-gold-accent/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-sans text-sm uppercase tracking-wider overflow-hidden"
          >
            {/* Pulsing ring overlay */}
            <span className="absolute inset-0 rounded-full border border-gold-accent animate-ping opacity-75 group-hover:hidden" />
            
            <MailOpen className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
