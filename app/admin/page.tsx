'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/utils';
import { Plus, Copy, Share2, Search, Trash2, Check, ExternalLink, Loader2, AlertTriangle, MessageSquare, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Guest {
  id: string;
  slug: string;
  nama: string;
  kategori: string;
  created_at: string;
}

interface Ucapan {
  id: string;
  nama: string;
  ucapan: string;
  kehadiran: 'hadir' | 'tidak_hadir' | 'tentatif';
  created_at: string;
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Ucapan[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Umum');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [dbError, setDbError] = useState(false);

  // Use production URL for sharing (so WhatsApp can fetch OG thumbnails)
  const shareOrigin = process.env.NEXT_PUBLIC_BASE_URL || origin;

  // Tab States
  const [activeTab, setActiveTab] = useState<'db' | 'instant'>('db');
  const [rightTab, setRightTab] = useState<'guests' | 'wishes'>('guests');

  // Instant Link Generator states
  const [instantNama, setInstantNama] = useState('');
  const [instantTemplate, setInstantTemplate] = useState<'formal' | 'casual'>('formal');
  const [instantCopied, setInstantCopied] = useState(false);

  const getInstantLink = () => {
    const slug = generateSlug(instantNama || 'Tamu Undangan');
    return `${shareOrigin}/i/${slug}`;
  };

  const getInstantMessage = () => {
    const inviteLink = getInstantLink();
    const guestName = instantNama.trim() || '[Nama Tamu]';
    
    if (instantTemplate === 'formal') {
      return `✨ *Undangan Pernikahan* ✨\n\nKepada Yth.\nBapak/Ibu/Saudara/i *${guestName}*\n\nAssalamu'alaikum Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:\n\n💍 *Dani Ramdani & Rika Rahmawati*\n📅 Sabtu, 14 Juni 2026\n📍 Kp. Cikoneng Hilir 01/04, Sukamaju, Sumedang\n\n🔗 Buka Undangan Digital:\n${inviteLink}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. 🙏\n\nWassalamu'alaikum Wr. Wb.\n\n_Hormat kami,_\n*Dani & Rika* 💕`;
    } else {
      return `💌 *Hai ${guestName}!* 💌\n\nKamu spesial buat kami! 🥰\n\nKami, *Dani & Rika*, ingin mengundang kamu untuk hadir di hari bahagia kami! 🎉\n\n💍 Pernikahan Dani & Rika\n📅 Sabtu, 14 Juni 2026\n📍 Kp. Cikoneng Hilir 01/04, Sukamaju, Sumedang\n\n🔗 Yuk buka undangan digitalnya:\n${inviteLink}\n\nKehadiran dan doa restumu sangat berarti bagi kami! 🙏✨\n\nSampai ketemu ya! 👋\n*Dani & Rika* 💕`;
    }
  };

  const handleCopyInstant = async () => {
    const text = getInstantMessage();
    try {
      await navigator.clipboard.writeText(text);
      setInstantCopied(true);
      setTimeout(() => setInstantCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  const handleShareInstantWA = () => {
    const text = getInstantMessage();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareInstantTelegram = () => {
    const text = getInstantMessage();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getInstantLink())}&text=${encodeURIComponent(text.replace(getInstantLink(), ''))}`;
    window.open(telegramUrl, '_blank');
  };

  // Set window origin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Fetch guests from Supabase or localStorage
  useEffect(() => {
    async function fetchGuests() {
      try {
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setGuests(data as Guest[]);
        }
      } catch (error) {
        console.warn('Gagal memuat tamu dari Supabase. Menggunakan fallback localStorage:', error);
        setDbError(true);
        // Load from localStorage as fallback
        const local = localStorage.getItem('wedding_guests');
        if (local) {
          setGuests(JSON.parse(local));
        } else {
          // Add default dummy data
          const dummyGuests: Guest[] = [
            {
              id: '1',
              slug: 'ahmad-rizki-dan-keluarga',
              nama: 'Ahmad Rizki & Keluarga',
              kategori: 'VIP',
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              slug: 'siti-sarah',
              nama: 'Siti Sarah',
              kategori: 'Teman',
              created_at: new Date(Date.now() - 3600000).toISOString(),
            }
          ];
          setGuests(dummyGuests);
          localStorage.setItem('wedding_guests', JSON.stringify(dummyGuests));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGuests();
  }, []);

  // Fetch wishes and subscribe to realtime updates
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
        console.warn('Gagal memuat ucapan dari Supabase. Menggunakan fallback localStorage:', error);
        const local = localStorage.getItem('wedding_wishes');
        if (local) {
          setWishes(JSON.parse(local));
        } else {
          const dummyWishes: Ucapan[] = [
            {
              id: '1',
              nama: 'Budi Santoso',
              ucapan: 'Barakallahu lakum wa baraka alaikum. Selamat ya bro Dani, mantap sekali akhirnya pelaminan!',
              kehadiran: 'hadir',
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: '2',
              nama: 'Siti Sarah',
              ucapan: 'Happy wedding Rika sayang & kang Dani! Lancar-lancar acaranya ya. Maaf belum bisa hadir langsung tapi doa terbaik dari jauh.',
              kehadiran: 'tidak_hadir',
              created_at: new Date(Date.now() - 7200000).toISOString(),
            }
          ];
          setWishes(dummyWishes);
          localStorage.setItem('wedding_wishes', JSON.stringify(dummyWishes));
        }
      } finally {
        setLoadingWishes(false);
      }
    }

    fetchWishes();

    // Subscribe to realtime updates for ucapan
    const channel = supabase
      .channel('realtime_admin_ucapan')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ucapan' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newWish = payload.new as Ucapan;
            setWishes((prev) => [newWish, ...prev.filter(w => w.id !== newWish.id)]);
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setWishes((prev) => prev.filter((w) => w.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dbError]);

  const handleDeleteWish = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return;

    try {
      if (dbError) throw new Error('Supabase unconfigured');

      const { error } = await supabase
        .from('ucapan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWishes((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.warn('Gagal menghapus ucapan dari database, menghapus dari local state:', error);
      const updatedWishes = wishes.filter((w) => w.id !== id);
      setWishes(updatedWishes);
      localStorage.setItem('wedding_wishes', JSON.stringify(updatedWishes));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    setIsSubmitting(true);
    const slug = generateSlug(nama.trim());
    
    // Check if slug already exists to prevent duplicate key
    if (guests.some(g => g.slug === slug)) {
      alert('Nama tamu ini sudah menghasilkan slug yang sama. Silakan bedakan sedikit namanya (contoh tambahkan nama belakang atau alias).');
      setIsSubmitting(false);
      return;
    }

    const newGuest = {
      slug,
      nama: nama.trim(),
      kategori,
    };

    try {
      if (dbError) throw new Error('Supabase unconfigured');

      const { data, error } = await supabase
        .from('guests')
        .insert([newGuest])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setGuests((prev) => [data[0] as Guest, ...prev]);
      }
    } catch (error) {
      console.warn('Gagal menyimpan ke database, menyimpan ke localStorage:', error);
      
      const localGuest: Guest = {
        id: Math.random().toString(),
        slug: newGuest.slug,
        nama: newGuest.nama,
        kategori: newGuest.kategori,
        created_at: new Date().toISOString(),
      };

      const updatedGuests = [localGuest, ...guests];
      setGuests(updatedGuests);
      localStorage.setItem('wedding_guests', JSON.stringify(updatedGuests));
    } finally {
      setIsSubmitting(false);
      setNama('');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tamu ini?')) return;

    try {
      if (dbError) throw new Error('Supabase unconfigured');

      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.warn('Gagal menghapus dari database, menghapus dari localStorage:', error);
      const updatedGuests = guests.filter((g) => g.id !== id);
      setGuests(updatedGuests);
      localStorage.setItem('wedding_guests', JSON.stringify(updatedGuests));
    }
  };

  const handleCopyLink = async (guest: Guest) => {
    const inviteLink = `${shareOrigin}/i/${guest.slug}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin link:', err);
    }
  };

  const handleSendWA = (guest: Guest) => {
    const inviteLink = `${shareOrigin}/i/${guest.slug}`;
    const text = `✨ *Undangan Pernikahan* ✨\n\nKepada Yth.\nBapak/Ibu/Saudara/i *${guest.nama}*\n\nAssalamu'alaikum Wr. Wb.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:\n\n💍 *Dani Ramdani & Rika Rahmawati*\n📅 Sabtu, 14 Juni 2026\n📍 Kp. Cikoneng Hilir 01/04, Sukamaju, Sumedang\n\n🔗 Buka Undangan Digital:\n${inviteLink}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. 🙏\n\nWassalamu'alaikum Wr. Wb.\n\n_Hormat kami,_\n*Dani & Rika* 💕`;
    
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const filteredGuests = guests.filter(
    (g) =>
      g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-blue">Wedding Link Generator</h1>
            <p className="text-sm text-slate-500 mt-1">Dani Ramdani & Rika Rahmawati Wedding Invitation Admin Panel</p>
          </div>
          
          {dbError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium max-w-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Menggunakan **Local Storage** karena Supabase belum dikonfigurasi.</span>
            </div>
          )}
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tamu</span>
              <span className="block text-3xl font-extrabold text-navy-blue font-mono">{guests.length}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-navy-blue/10 text-navy-blue flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hadir</span>
              <span className="block text-3xl font-extrabold text-emerald-600 font-mono">
                {wishes.filter(w => w.kehadiran === 'hadir').length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tidak Hadir</span>
              <span className="block text-3xl font-extrabold text-rose-600 font-mono">
                {wishes.filter(w => w.kehadiran === 'tidak_hadir').length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Respon</span>
              <span className="block text-3xl font-extrabold text-gold-accent font-mono">
                {guests.length > 0 ? Math.round((wishes.length / guests.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-gold-accent border border-amber-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left: Input Form & Instant Link Generator */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('db')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === 'db'
                      ? 'border-navy-blue text-navy-blue font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Simpan DB
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('instant')}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === 'instant'
                      ? 'border-navy-blue text-navy-blue font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Link Instan
                </button>
              </div>

              {activeTab === 'db' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="guest-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nama Tamu
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Ahmad Rizki & Keluarga"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="guest-category" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Kategori Tamu
                    </label>
                    <select
                      id="guest-category"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent text-sm bg-white"
                    >
                      <option value="Umum">Umum</option>
                      <option value="VIP">VIP</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Teman">Teman</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-navy-blue hover:bg-navy-dark text-white rounded-lg font-medium text-xs uppercase tracking-wider transition-all duration-300 shadow cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Link Undangan</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="instant-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nama Tamu (Instan)
                    </label>
                    <input
                      id="instant-name"
                      type="text"
                      value={instantNama}
                      onChange={(e) => setInstantNama(e.target.value)}
                      placeholder="Masukkan nama tamu..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="instant-template" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Gaya Bahasa
                    </label>
                    <select
                      id="instant-template"
                      value={instantTemplate}
                      onChange={(e) => setInstantTemplate(e.target.value as 'formal' | 'casual')}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent text-sm bg-white"
                    >
                      <option value="formal">Formal & Sopan</option>
                      <option value="casual">Kasual & Teman</option>
                    </select>
                  </div>

                  {/* Message Preview Box */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pratinjau Pesan WA
                    </span>
                    <div className="w-full p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-[11px] leading-relaxed max-h-40 overflow-y-auto font-mono whitespace-pre-wrap select-all">
                      {getInstantMessage()}
                    </div>
                  </div>

                  {/* Share / Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {/* WhatsApp Button */}
                    <button
                      type="button"
                      onClick={handleShareInstantWA}
                      disabled={!instantNama.trim()}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Kirim WhatsApp</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Copy Text Button */}
                      <button
                        type="button"
                        onClick={handleCopyInstant}
                        disabled={!instantNama.trim()}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                          instantCopied
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {instantCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Teks</span>
                          </>
                        )}
                      </button>

                      {/* Telegram Button */}
                      <button
                        type="button"
                        onClick={handleShareInstantTelegram}
                        disabled={!instantNama.trim()}
                        className="flex items-center justify-center gap-1.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Telegram</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Guest List or Wishes Moderation */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Right Panel Tab Selector */}
            <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-300/30">
              <button
                type="button"
                onClick={() => setRightTab('guests')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightTab === 'guests'
                    ? 'bg-white text-navy-blue shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Daftar Tamu ({guests.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setRightTab('wishes')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightTab === 'wishes'
                    ? 'bg-white text-navy-blue shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Moderasi Ucapan ({wishes.length})</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {rightTab === 'guests' ? (
                <>
                  {/* Search Bar */}
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama tamu atau kategori..."
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-accent/50 focus:border-gold-accent text-xs"
                      />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 shrink-0">
                      Total Tamu: {filteredGuests.length}
                    </div>
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-accent mb-2" />
                      <span className="text-xs text-slate-400">Memuat daftar tamu...</span>
                    </div>
                  ) : filteredGuests.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 italic text-sm">
                      Belum ada tamu terdaftar. Silakan tambah tamu di form sebelah kiri.
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold text-[10px]">
                              <th className="py-3 px-4">Nama Tamu</th>
                              <th className="py-3 px-4">Kategori</th>
                              <th className="py-3 px-4">Slug</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredGuests.map((guest) => {
                              return (
                                <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-navy-blue">
                                    <div className="flex items-center gap-1.5">
                                      <span>{guest.nama}</span>
                                      <a 
                                        href={`/invitation/${guest.slug}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-slate-400 hover:text-gold-accent"
                                        title="Pratinjau Layer 1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      guest.kategori === 'VIP' 
                                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                        : guest.kategori === 'Keluarga'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                        : guest.kategori === 'Teman'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {guest.kategori}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">
                                    {guest.slug}
                                  </td>
                                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                    {/* Copy Button */}
                                    <button
                                      onClick={() => handleCopyLink(guest)}
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-all cursor-pointer ${
                                        copiedId === guest.id
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                                      }`}
                                      title="Salin Link Undangan"
                                    >
                                      {copiedId === guest.id ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Tersalin</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Salin</span>
                                        </>
                                      )}
                                    </button>

                                    {/* WhatsApp Share Button */}
                                    <button
                                      onClick={() => handleSendWA(guest)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded border border-emerald-500 transition-all cursor-pointer"
                                      title="Kirim via WhatsApp"
                                    >
                                      <Share2 className="w-3 h-3" />
                                      <span>Kirim WA</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDelete(guest.id, guest.slug)}
                                      className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                                      title="Hapus Tamu"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="md:hidden p-4 space-y-3 divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                        {filteredGuests.map((guest, idx) => (
                          <div key={guest.id} className={`pt-3 space-y-2.5 ${idx === 0 ? '!pt-0' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="font-bold text-navy-blue flex items-center gap-1.5 text-sm">
                                  <span>{guest.nama}</span>
                                  <a 
                                    href={`/invitation/${guest.slug}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-gold-accent"
                                    title="Pratinjau Layer 1"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                                <div className="text-[10px] font-mono text-slate-400">{guest.slug}</div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                                guest.kategori === 'VIP' 
                                  ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                  : guest.kategori === 'Keluarga'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : guest.kategori === 'Teman'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {guest.kategori}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <div className="flex items-center gap-2 w-full">
                                {/* Copy Button */}
                                <button
                                  onClick={() => handleCopyLink(guest)}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                                    copiedId === guest.id
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {copiedId === guest.id ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Tersalin</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Salin Link</span>
                                    </>
                                  )}
                                </button>

                                {/* WhatsApp Share Button */}
                                <button
                                  onClick={() => handleSendWA(guest)}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded border border-emerald-500 text-[10px] font-semibold transition-all cursor-pointer"
                                >
                                  <Share2 className="w-3 h-3" />
                                  <span>Kirim WA</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDelete(guest.id, guest.slug)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Wishes Moderation Tab */
                <>
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moderasi Doa & Ucapan</span>
                    <span className="text-xs font-semibold text-slate-500 font-mono">Total RSVP: {wishes.length}</span>
                  </div>

                  {loadingWishes ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-accent mb-2" />
                      <span className="text-xs text-slate-400">Memuat data ucapan...</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto animate-fade-in">
                      {wishes.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 italic text-sm">
                          Belum ada ucapan atau doa masuk dari tamu.
                        </div>
                      ) : (
                        wishes.map((wish) => (
                          <div key={wish.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-navy-blue text-sm">{wish.nama}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  wish.kehadiran === 'hadir'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {wish.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(wish.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{wish.ucapan}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteWish(wish.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 transition-all cursor-pointer shrink-0"
                              title="Hapus Ucapan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
