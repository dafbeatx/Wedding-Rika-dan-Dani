'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailOpen } from 'lucide-react';
import Image from 'next/image';
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
      <div className="absolute inset-4 border border-gold-accent/25 pointer-events-none rounded-lg z-10" />
      <div className="absolute inset-6 border border-gold-accent/10 pointer-events-none rounded-lg z-10 animate-pulse-slow" />

      {/* Floating Sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/3 right-1/4 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute w-2 h-2 bg-gold-accent rounded-full bottom-1/4 right-1/3 animate-ping" style={{ animationDuration: '5s' }} />
        <div className="absolute w-1 h-1 bg-white rounded-full bottom-1/3 left-1/5 animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      {/* Content Card */}
      <div className="relative w-full max-w-lg px-8 py-14 mx-4 text-center glass-white rounded-2xl shadow-2xl flex flex-col items-center justify-between min-h-[520px] z-20 animate-fade-in-up border border-gold-accent/20">
        
        {/* Frame ornament overlay */}
        <div className="absolute inset-2.5 pointer-events-none z-0 mix-blend-multiply opacity-85">
          <Image
            src="/decor/frame.png"
            alt="Frame Border"
            fill
            className="object-fill rounded-xl"
            priority
          />
        </div>

        {/* Top Header */}
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold-accent font-bold">
            Walimatul 'Ursy
          </p>
          <div className="relative w-28 h-5 mx-auto mix-blend-multiply">
            <Image
              src="/decor/divider.png"
              alt="Divider"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Names */}
        <div className="my-3 space-y-2 relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-navy-blue tracking-wide">
            Dani & Rika
          </h1>
          <p className="font-sans text-xs tracking-[0.2em] text-gold-accent font-bold">
            AHAD, 14 JUNI 2026
          </p>
        </div>

        {/* Guest Greeting Section */}
        <div className="w-full max-w-sm px-6 py-5 rounded-xl bg-slate-50/90 border border-gold-accent/15 space-y-2.5 relative z-10 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-navy-blue px-2 line-clamp-2">
            {guestName}
          </h2>
          <div className="relative w-24 h-4 mx-auto mix-blend-multiply">
            <Image
              src="/decor/divider.png"
              alt="Divider"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[10px] text-slate-400 italic">
            *Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda untuk Hadir di Hari Bahagia Kami.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8 relative z-10">
          <button
            id="btn-open-invitation"
            onClick={handleOpenInvitation}
            className="group relative flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-navy-blue to-navy-dark hover:from-navy-dark hover:to-navy-blue text-white font-medium rounded-full shadow-lg hover:shadow-navy-blue/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-sans text-sm uppercase tracking-wider overflow-hidden"
          >
            {/* Pulsing ring overlay */}
            <span className="absolute inset-0 rounded-full border border-navy-blue animate-ping opacity-75 group-hover:hidden" />
            
            <MailOpen className="w-4 h-4 transition-transform group-hover:rotate-12 text-gold-accent" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
