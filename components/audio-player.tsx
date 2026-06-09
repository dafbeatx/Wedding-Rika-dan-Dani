'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Autoplay handling once user reaches Layer 2
    const hasOpened = sessionStorage.getItem('invitation_opened') === 'true';
    
    if (hasOpened && audioRef.current) {
      const playAudio = async () => {
        try {
          audioRef.current!.volume = 0.4; // Set gentle volume
          await audioRef.current!.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay blocked initially, waiting for user click:', error);
        }
      };
      
      playAudio();
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Play request failed:', err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center justify-center">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/marry-your-daughter.mp3"
        loop
        preload="auto"
      />

      {/* Floating Rotating Disc Button */}
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full glass-white shadow-xl border border-gold-accent/40 text-navy-blue transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer`}
        title={isPlaying ? 'Pause Musik' : 'Putar Musik'}
        id="btn-toggle-music"
      >
        {/* Decorative rotating gold ring */}
        <span 
          className={`absolute inset-0 rounded-full border border-dashed border-gold-accent/60 ${
            isPlaying ? 'animate-spin-slow' : ''
          }`} 
        />
        
        {/* Icon container */}
        <div className={`relative ${isPlaying ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }}>
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-gold-accent group-hover:scale-105" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400 group-hover:scale-105" />
          )}
        </div>
      </button>
    </div>
  );
}
