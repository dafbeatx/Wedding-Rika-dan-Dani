import React from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { decodeSlug } from '@/lib/utils';
import AudioPlayer from '@/components/audio-player';
import BottomNavigation from '@/components/bottom-navigation';
import Countdown from '@/components/countdown';
import Gallery from '@/components/gallery';
import Guestbook from '@/components/guestbook';
import CopyButton from '@/components/copy-button';
import { Calendar, MapPin, Clock, Phone, Heart } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guestName = decodeSlug(slug);
  return {
    title: `Pernikahan Dani & Rika - Undangan Resmi untuk ${guestName}`,
    description: `Detail acara pernikahan Dani Ramdani & Rika Rahmawati pada 14 Juni 2026.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  let guestName = '';

  try {
    const { data } = await supabase
      .from('guests')
      .select('nama')
      .eq('slug', slug)
      .single();
    if (data?.nama) {
      guestName = data.nama;
    } else {
      guestName = decodeSlug(slug);
    }
  } catch (e) {
    guestName = decodeSlug(slug);
  }

  return (
    <main className="relative bg-slate-50 min-h-screen text-slate-800 selection:bg-gold-accent/30 pb-20 md:pb-0">
      {/* Floating Audio Player */}
      <AudioPlayer />

      {/* Floating Bottom Navigation for Mobile */}
      <BottomNavigation />

      {/* 1. HERO BANNER */}
      <section 
        id="hero"
        className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 19, 36, 0.6), rgba(10, 19, 36, 0.85)), url('/gallery/gallery1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-navy-dark/20 z-0 pointer-events-none" />
        
        {/* Decorative corner leaves */}
        <div className="absolute inset-6 border border-gold-accent/10 rounded-lg pointer-events-none z-10" />

        <div className="relative z-10 space-y-6 max-w-xl mx-auto animate-fade-in">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-accent font-semibold">
            Walimatul 'Ursy
          </p>
          <div className="w-16 h-[1px] bg-gold-accent/40 mx-auto" />
          
          <h1 className="font-serif text-5xl md:text-7xl font-light text-gradient-gold tracking-wide py-2">
            Dani & Rika
          </h1>
          
          <p className="font-sans text-sm md:text-base tracking-[0.2em] text-slate-200">
            MINGGU, 14 JUNI 2026
          </p>

          <div className="pt-8">
            <Countdown />
          </div>

          {/* Guest Label */}
          <div className="pt-8 text-slate-300 font-sans text-xs uppercase tracking-widest">
            Spesial Untuk: <span className="text-gold-accent font-bold font-serif text-sm block mt-1 normal-case tracking-normal">{guestName}</span>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-75">
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-300">Scroll Down</span>
          <div className="w-5 h-8 border-2 border-gold-accent/50 rounded-full p-1 flex justify-center">
            <div className="w-1 h-2 bg-gold-accent rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Animated Separator */}
      <div className="relative w-48 h-8 mx-auto my-12 mix-blend-multiply opacity-80 animate-pulse-slow select-none z-10">
        <Image src="/decor/divider.png" alt="Decorative Divider" fill className="object-contain" />
      </div>

      {/* 2. VERSE / KUTIPAN */}
      <section className="py-20 px-6 bg-white bg-wedding-pattern bg-blend-overlay bg-white/95 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <Heart className="w-8 h-8 text-gold-accent mx-auto animate-pulse-slow" />
          <p className="font-serif text-base italic leading-relaxed text-slate-600">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-blue">
            QS. Ar-Rum: 21
          </p>
          <div className="relative w-16 h-16 mx-auto mix-blend-multiply opacity-75 mt-2">
            <Image src="/decor/accent.png" alt="Floral Accent" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Animated Separator */}
      <div className="relative w-48 h-8 mx-auto my-12 mix-blend-multiply opacity-80 animate-pulse-slow select-none z-10">
        <Image src="/decor/divider.png" alt="Decorative Divider" fill className="object-contain" />
      </div>

      {/* 3. MEMPELAI (BRIDE & GROOM) */}
      <section id="mempelai" className="py-24 px-6 bg-slate-50 bg-wedding-pattern bg-blend-overlay bg-slate-50/95 relative overflow-hidden">
        {/* Corner Ornaments */}
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-25 select-none">
          <Image src="/decor/corner.png" alt="Corner Ornament" fill className="object-cover" />
        </div>
        {/* Subtle Background Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold-accent/5 filter blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-navy-blue/5 filter blur-3xl" />

        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy-blue">Kedua Mempelai</h2>
            <div className="relative w-40 h-6 mx-auto mix-blend-multiply opacity-90">
              <Image src="/decor/divider.png" alt="Divider" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Maha Suci Allah yang telah mempertautkan dua hati dalam ikatan suci pernikahan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-10">
            {/* Mempelai Pria */}
            <div className="flex flex-col items-center text-center space-y-6 group">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gold-accent shadow-xl transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/gallery/groom.jpg"
                  alt="Dani Ramdani"
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-navy-blue">Dani Ramdani, S.Kom</h3>
                <p className="text-xs uppercase tracking-widest text-gold-accent font-bold">Dani</p>
                <div className="w-8 h-[1px] bg-slate-300 mx-auto my-3" />
                <p className="text-sm text-slate-600">
                  Putra kedua dari
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  Bapa Eman & Ibu Elis
                </p>
              </div>
            </div>

            {/* Mempelai Wanita */}
            <div className="flex flex-col items-center text-center space-y-6 group">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gold-accent shadow-xl transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/gallery/bride.jpg"
                  alt="Rika Rahmawati"
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-navy-blue">Rika Rahmawati, S.Pd</h3>
                <p className="text-xs uppercase tracking-widest text-gold-accent font-bold">Rika</p>
                <div className="w-8 h-[1px] bg-slate-300 mx-auto my-3" />
                <p className="text-sm text-slate-600">
                  Putri pertama dari
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  Bapak Uki & Ibu Siti Aisah
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACARA (EVENT DETAILS) */}
      <section id="acara" className="py-24 px-6 bg-navy-dark text-white relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" style={{ backgroundImage: `url('/gallery/gallery2.jpg')` }} />
        
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gradient-gold">Informasi Acara</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam momen sakral kami.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Akad Nikah */}
            <div className="glass-navy p-8 rounded-2xl border border-gold-accent/30 text-center space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-gold-accent/15 text-gold-accent flex items-center justify-center mx-auto border border-gold-accent/25">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-100 uppercase tracking-widest">Akad Nikah</h3>
                <div className="w-8 h-[1px] bg-gold-accent/40 mx-auto" />
                
                <div className="space-y-2 font-sans text-sm text-slate-300">
                  <p className="font-bold text-gold-accent">Minggu, 14 Juni 2026</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Clock className="w-4 h-4 text-gold-accent" />
                    <span>Pukul 10.00 WIB - Selesai</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-slate-400 bg-navy-dark/40 p-3 rounded-lg border border-white/5">
                Keluarga & Saksi Akad
              </div>
            </div>

            {/* Resepsi */}
            <div className="glass-navy p-8 rounded-2xl border border-gold-accent/30 text-center space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-gold-accent/15 text-gold-accent flex items-center justify-center mx-auto border border-gold-accent/25">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-100 uppercase tracking-widest">Resepsi</h3>
                <div className="w-8 h-[1px] bg-gold-accent/40 mx-auto" />
                
                <div className="space-y-2 font-sans text-sm text-slate-300">
                  <p className="font-bold text-gold-accent">Minggu, 14 Juni 2026</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Clock className="w-4 h-4 text-gold-accent" />
                    <span>Pukul 11.30 WIB - Selesai</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-navy-dark/40 p-3 rounded-lg border border-white/5">
                Tamu Undangan Umum & Relasi
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="glass-navy p-6 md:p-8 rounded-2xl border border-gold-accent/30 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gold-accent/15 text-gold-accent flex items-center justify-center mx-auto border border-gold-accent/25">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-100 uppercase tracking-widest">Lokasi Acara</h3>
            
            <p className="font-sans text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Kp. Tapos RT.02 RW.08, Desa Pasarean, Kec. Pamijahan, Kab. Bogor
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 py-2">
              <span className="px-3 py-1 rounded-full bg-navy-dark/60 border border-white/5">Dresscode: Bebas & Sopan</span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-navy-dark/60 border border-white/5">
                <Phone className="w-3.5 h-3.5 text-gold-accent" />
                CP: 0812-2576-1446
              </span>
            </div>

            {/* Google Maps Embed */}
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-inner border border-gold-accent/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.023247012976!2d106.643329!3d-6.64399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69da5c09d57a55%3A0x6b7fa9e1d53086eb!2sPasarean%2C%20Pamijahan%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1717900000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>

            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/D2x189oCmMCZuk6J8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-accent hover:bg-gold-hover text-navy-dark rounded-full text-xs uppercase tracking-wider font-semibold shadow-lg hover:shadow-gold-accent/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                Buka Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Separator */}
      <div className="relative w-48 h-8 mx-auto my-12 mix-blend-multiply opacity-80 animate-pulse-slow select-none z-10">
        <Image src="/decor/divider.png" alt="Decorative Divider" fill className="object-contain" />
      </div>

      {/* 5. GALERI FOTO */}
      <section id="galeri" className="py-24 px-6 bg-white bg-wedding-pattern bg-blend-overlay bg-white/95 relative overflow-hidden">
        {/* Corner Ornaments */}
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-25 select-none">
          <Image src="/decor/corner.png" alt="Corner Ornament" fill className="object-cover" />
        </div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy-blue">Galeri Bahagia</h2>
            <div className="relative w-40 h-6 mx-auto mix-blend-multiply opacity-90">
              <Image src="/decor/divider.png" alt="Divider" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Ukiran momen kebersamaan yang kami abadikan menuju gerbang mahligai rumah tangga.
            </p>
          </div>

          <Gallery />
        </div>
      </section>

      {/* Animated Separator */}
      <div className="relative w-48 h-8 mx-auto my-12 mix-blend-multiply opacity-80 animate-pulse-slow select-none z-10">
        <Image src="/decor/divider.png" alt="Decorative Divider" fill className="object-contain" />
      </div>

      {/* 6. AMPLOP DIGITAL (DIGITAL GIFT) */}
      <section id="amplop" className="py-24 px-6 bg-slate-50 bg-wedding-pattern bg-blend-overlay bg-slate-50/95 relative overflow-hidden">
        {/* Corner Ornaments */}
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-25 select-none">
          <Image src="/decor/corner.png" alt="Corner Ornament" fill className="object-cover" />
        </div>
        <div className="max-w-xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy-blue">Amplop Digital</h2>
            <div className="relative w-40 h-6 mx-auto mix-blend-multiply opacity-90">
              <Image src="/decor/divider.png" alt="Divider" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Bagi Anda yang ingin memberikan tanda kasih atau ucapan secara digital, dapat ditujukan melalui rekening di bawah ini:
            </p>
          </div>

          <div className="space-y-6">
            {/* Rekening Dani */}
            <div className="glass-white p-6 rounded-2xl border border-gold-accent/20 shadow-md text-center space-y-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Transfer Bank (Dani)</p>
              <div className="space-y-1">
                <p className="font-bold text-navy-blue text-lg">Bank Mandiri</p>
                <p className="font-mono text-xl tracking-wider text-slate-700">762799722200</p>
                <p className="text-xs text-slate-500">a.n. Dani Ramdani</p>
              </div>
              <div className="pt-2">
                <CopyButton text="762799722200" />
              </div>
            </div>

            {/* DANA Rika */}
            <div className="glass-white p-6 rounded-2xl border border-gold-accent/20 shadow-md text-center space-y-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">E-Wallet DANA (Rika)</p>
              <div className="space-y-1">
                <p className="font-bold text-sky-blue text-lg">DANA</p>
                <p className="font-mono text-xl tracking-wider text-slate-700">+62 857-7625-2404</p>
                <p className="text-xs text-slate-500">a.n. Rika Rahmawati</p>
              </div>
              <div className="pt-2">
                <CopyButton text="+6285776252404" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Separator */}
      <div className="relative w-48 h-8 mx-auto my-12 mix-blend-multiply opacity-80 animate-pulse-slow select-none z-10">
        <Image src="/decor/divider.png" alt="Decorative Divider" fill className="object-contain" />
      </div>

      {/* 7. UCAPAN & RSVP */}
      <section id="ucapan" className="py-24 px-6 bg-white bg-wedding-pattern bg-blend-overlay bg-white/95 border-t border-slate-100">
        <Guestbook initialGuestName={guestName} />
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-navy-dark text-white py-16 px-6 text-center border-t border-gold-accent/10 relative">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <p className="font-serif text-base text-slate-300 leading-relaxed italic">
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
          </p>
          <div className="w-12 h-[1px] bg-gold-accent/30 mx-auto my-6" />
          
          <h3 className="font-serif text-3xl font-light text-gradient-gold tracking-wide">
            Dani & Rika
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Kami yang berbahagia, Keluarga Besar Mempelai Pria & Wanita
          </p>

          <p className="text-[10px] text-slate-500 pt-8 uppercase tracking-widest font-sans">
            Created with ❤️ for Dani & Rika Wedding • 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
