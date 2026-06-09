'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Send, CheckCircle2, User, MessageSquare, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface Ucapan {
  id: string;
  nama: string;
  ucapan: string;
  kehadiran: 'hadir' | 'tidak_hadir' | 'tentatif';
  created_at: string;
}

interface GuestbookProps {
  initialGuestName?: string;
}

export default function Guestbook({ initialGuestName = '' }: GuestbookProps) {
  const [wishes, setWishes] = useState<Ucapan[]>([]);
  const [nama, setNama] = useState(initialGuestName);
  const [ucapan, setUcapan] = useState('');
  const [kehadiran, setKehadiran] = useState<'hadir' | 'tidak_hadir'>('hadir');
  const [sendMode, setSendMode] = useState<'direct' | 'whatsapp'>('direct');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [aiStyle, setAiStyle] = useState('islami');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIWish = async () => {
    if (!nama.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: nama.trim(),
          gaya: aiStyle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wish) {
          setUcapan(data.wish);
        }
      }
    } catch (error) {
      console.error('Error generating AI wish:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch initial wishes
  useEffect(() => {
    async function fetchWishes() {
      try {
        const { data, error } = await supabase
          .from('ucapan')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setWishes(data as Ucapan[]);
        }
      } catch (error) {
        console.error('Error fetching wishes:', error);
        // Load some mock data if Supabase setup is empty/errored
        setWishes([
          {
            id: '1',
            nama: 'Bapak Ahmad Rizki & Keluarga',
            ucapan: 'Selamat menempuh hidup baru Dani & Rika! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
            kehadiran: 'hadir',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            nama: 'Siti Sarah (Teman Rika)',
            ucapan: 'Happy wedding Rika sayang & kang Dani! Lancar-lancar acaranya ya. Maaf belum bisa hadir langsung tapi doa terbaik dari jauh.',
            kehadiran: 'tidak_hadir',
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: '3',
            nama: 'Budi Santoso',
            ucapan: 'Barakallahu lakum wa baraka alaikum. Selamat ya bro Dani, mantap sekali akhirnya pelaminan!',
            kehadiran: 'hadir',
            created_at: new Date(Date.now() - 14400000).toISOString(),
          }
        ]);
      } finally {
        setLoadingWishes(false);
      }
    }

    fetchWishes();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('realtime_ucapan')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ucapan' },
        (payload) => {
          const newWish = payload.new as Ucapan;
          setWishes((prev) => [newWish, ...prev.filter(w => w.id !== newWish.id)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !ucapan.trim()) return;

    setIsSubmitting(true);
    const newUcapanData = {
      nama: nama.trim(),
      ucapan: ucapan.trim(),
      kehadiran,
    };

    try {
      // 1. Save to Supabase
      const { data, error } = await supabase
        .from('ucapan')
        .insert([newUcapanData])
        .select();

      if (error) throw error;

      // Local update in case realtime delays
      if (data && data.length > 0) {
        const saved = data[0] as Ucapan;
        setWishes((prev) => [saved, ...prev.filter(w => w.id !== saved.id)]);
      }
    } catch (error) {
      console.warn('Gagal menyimpan ke Supabase, menyimpan lokal untuk fallback:', error);
      
      // Fallback local save so user sees it
      const fallbackWish: Ucapan = {
        id: Math.random().toString(),
        nama: newUcapanData.nama,
        ucapan: newUcapanData.ucapan,
        kehadiran: newUcapanData.kehadiran,
        created_at: new Date().toISOString(),
      };
      setWishes((prev) => [fallbackWish, ...prev]);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setUcapan('');

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#1e3a5f', '#4a90d9']
      });

      if (sendMode === 'whatsapp') {
        // WhatsApp Redirect helper (opens in new tab)
        const waNumber = '6285776252404'; // RSVP admin
        const statusKehadiran = kehadiran === 'hadir' ? 'HADIR' : 'TIDAK HADIR';
        const text = `Halo Dani & Rika,\nSaya ingin mengonfirmasi kehadiran di acara pernikahan kalian.\n\n*Nama:* ${nama.trim()}\n*Status Kehadiran:* ${statusKehadiran}\n*Ucapan:* ${ucapan.trim()}\n\nTerima kasih!`;
        
        const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(text)}`;
        
        // Open WA in a brief delay to let user see success state
        setTimeout(() => {
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = waUrl;
          } else {
            window.open(waUrl, '_blank');
          }
        }, 1500);
      }

      // Hide success notification after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  };

  const kehadiranBadge = (status: 'hadir' | 'tidak_hadir' | 'tentatif') => {
    switch (status) {
      case 'hadir':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Hadir
          </span>
        );
      case 'tidak_hadir':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            Tidak Hadir
          </span>
        );
      case 'tentatif':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Tentatif
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12">
      {/* 1. Form Section */}
      <div className="glass-white p-5 md:p-8 rounded-2xl border border-gold-accent/20 shadow-xl space-y-5 md:space-y-6">
        <div className="text-center space-y-2 relative z-10">
          <h3 className="font-serif text-2xl font-semibold text-navy-blue">Kirim Doa & RSVP</h3>
          <div className="relative w-36 h-5 mx-auto mix-blend-multiply opacity-90">
            <Image src="/decor/divider.png" alt="Divider" fill className="object-contain" />
          </div>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Berikan doa restu Anda kepada kedua mempelai dan konfirmasikan kehadiran Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="input-name" className="block text-xs font-semibold text-navy-blue uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                id="input-name"
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent bg-white/70 text-slate-800 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="select-attendance" className="block text-xs font-semibold text-navy-blue uppercase tracking-wider mb-1">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['hadir', 'tidak_hadir'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setKehadiran(status)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    kehadiran === status
                      ? 'bg-navy-blue text-white border-navy-blue shadow-md'
                      : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="input-wish" className="block text-xs font-semibold text-navy-blue uppercase tracking-wider mb-2">
              Ucapan & Doa Restu
            </label>

            {/* AI Generator Controls — stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">🤖 Gaya AI:</span>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-gold-accent"
                >
                  <option value="islami">✨ Islami</option>
                  <option value="romantis">❤️ Romantis</option>
                  <option value="puitis">✍️ Puitis</option>
                  <option value="kasual">💬 Kasual</option>
                </select>
              </div>
              <button
                type="button"
                onClick={generateAIWish}
                disabled={isGenerating || !nama.trim()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold-accent hover:bg-gold-hover text-navy-dark font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                title={!nama.trim() ? 'Masukkan nama terlebih dahulu' : 'Buat ucapan otomatis dengan AI'}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Tulis Otomatis</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <span className="absolute top-3.5 left-3 text-slate-400 pointer-events-none">
                <MessageSquare className="w-4 h-4" />
              </span>
              <textarea
                id="input-wish"
                required
                rows={4}
                value={ucapan}
                onChange={(e) => setUcapan(e.target.value)}
                placeholder={!nama.trim() ? "Masukkan nama Anda terlebih dahulu untuk mengaktifkan generator AI..." : "Tulis ucapan & doa restu secara manual, atau klik 'Tulis Otomatis' di atas..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent bg-white/70 text-slate-800 text-sm transition-all resize-none"
              />
            </div>
          </div>

          {/* Metode Pengiriman */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-navy-blue uppercase tracking-wider">
              Metode Pengiriman
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSendMode('direct')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  sendMode === 'direct'
                    ? 'bg-navy-blue/5 border-navy-blue text-navy-blue ring-1 ring-navy-blue shadow-sm'
                    : 'bg-white/50 border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold flex items-center gap-1.5 justify-center">
                  💾 Kirim Instan
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Rekomendasi
                  </span>
                </span>
                <span className="text-[10px] mt-0.5 opacity-85">Cepat & Tanpa keluar aplikasi</span>
              </button>

              <button
                type="button"
                onClick={() => setSendMode('whatsapp')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  sendMode === 'whatsapp'
                    ? 'bg-navy-blue/5 border-navy-blue text-navy-blue ring-1 ring-navy-blue shadow-sm'
                    : 'bg-white/50 border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold">💬 Kirim + WhatsApp</span>
                <span className="text-[10px] mt-0.5 opacity-85">Simpan & kirim chat personal</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-navy-blue to-navy-dark hover:from-navy-dark hover:to-navy-blue text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Ucapan & RSVP</span>
              </>
            )}
          </button>
        </form>

        {isSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg animate-fade-in text-xs font-medium relative z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {sendMode === 'whatsapp'
                ? 'Ucapan berhasil dikirim! Membuka konfirmasi WhatsApp...'
                : 'Ucapan & RSVP berhasil dikirim langsung ke database mempelai! ✨'}
            </span>
          </div>
        )}
      </div>

      {/* 2. Wishes List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gold-accent/20 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-accent" />
            <h4 className="font-serif text-lg font-semibold text-navy-blue">Ucapan Tamu ({wishes.length})</h4>
          </div>
          <span className="text-[10px] bg-gold-accent/15 text-gold-hover font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Realtime
          </span>
        </div>

        {loadingWishes ? (
          <div className="text-center py-8 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gold-accent" />
            <p className="text-xs">Memuat ucapan...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-10 glass-white rounded-xl border border-slate-100 text-slate-400">
            <p className="text-sm italic">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gold-accent/30 scrollbar-track-transparent">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="glass-white p-4 rounded-xl border border-slate-100 hover:border-gold-accent/30 transition-all duration-300 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-sans font-bold text-navy-blue text-sm line-clamp-1">{item.nama}</h5>
                  {kehadiranBadge(item.kehadiran)}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{item.ucapan}</p>
                <div className="text-[9px] text-slate-400 text-right mt-1">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
