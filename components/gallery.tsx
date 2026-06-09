'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  {
    src: '/gallery/gallery1.jpg',
    alt: 'Dani & Rika Prewedding 1',
  },
  {
    src: '/gallery/gallery2.jpg',
    alt: 'Dani & Rika Prewedding 2',
  },
  {
    src: '/gallery/gallery3.jpg',
    alt: 'Dani & Rika Prewedding 3',
  },
  {
    src: '/gallery/gallery4.jpg',
    alt: 'Dani & Rika Prewedding 4',
  },
  {
    src: '/gallery/gallery5.jpg',
    alt: 'Dani & Rika Prewedding 5',
  },
];

export default function Gallery() {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
  };

  const closeLightbox = () => {
    setPhotoIndex(null);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex === null) return;
    setPhotoIndex((prev) => (prev === 0 ? IMAGES.length - 1 : prev! - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex === null) return;
    setPhotoIndex((prev) => (prev === IMAGES.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="space-y-6">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {IMAGES.map((img, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative h-48 md:h-64 rounded-xl overflow-hidden shadow-md cursor-pointer border border-gold-accent/10 transition-transform duration-500 hover:scale-[1.02]"
          >
            {/* Overlay hover effect */}
            <div className="absolute inset-0 bg-navy-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full glass-white text-navy-blue font-sans text-xs uppercase tracking-wider font-semibold">
                Lihat Foto
              </span>
            </div>
            
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {photoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left navigation */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Enlarged Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[70vh] md:h-[80vh] rounded-lg overflow-hidden animate-scale-in"
          >
            <Image
              src={IMAGES[photoIndex].src}
              alt={IMAGES[photoIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Right navigation */}
          <button
            onClick={nextPhoto}
            className="absolute right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image caption */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-slate-300 font-sans text-sm uppercase tracking-widest">
            {photoIndex + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </div>
  );
}
