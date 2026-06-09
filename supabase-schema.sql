-- =========================================================================
-- DATABASE SCHEMA: Dani & Rika Digital Wedding Invitation
-- =========================================================================
-- Instructions: Paste this script directly into your Supabase SQL Editor.
-- Make sure to enable Realtime for the 'ucapan' table in your Supabase dashboard
-- (Database > Replication > supabase_realtime).
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. TABLE: guests
-- ---------------------------------------------------------
create table if not exists public.guests (
    id uuid default gen_random_uuid() primary key,
    slug text not null unique,
    nama text not null,
    kategori text default 'Umum',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for slug search performance
create index if not exists idx_guests_slug on public.guests(slug);

-- Enable RLS for guests
alter table public.guests enable row level security;

-- Policies for guests
create policy "Allow public read-only access to guests" 
on public.guests for select 
using (true);

create policy "Allow public insert access to guests" 
on public.guests for insert 
with check (true);

create policy "Allow public delete access to guests" 
on public.guests for delete 
using (true);


-- ---------------------------------------------------------
-- 2. TABLE: ucapan
-- ---------------------------------------------------------
create table if not exists public.ucapan (
    id uuid default gen_random_uuid() primary key,
    nama text not null,
    ucapan text not null,
    kehadiran text not null check (kehadiran in ('hadir', 'tidak_hadir', 'tentatif')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for ucapan
alter table public.ucapan enable row level security;

-- Policies for ucapan
create policy "Allow public read access to ucapan" 
on public.ucapan for select 
using (true);

create policy "Allow public insert access to ucapan" 
on public.ucapan for insert 
with check (true);


-- ---------------------------------------------------------
-- 3. DUMMY DATA / SAMPLE GUESTS
-- ---------------------------------------------------------
insert into public.guests (slug, nama, kategori) values
('tamu-undangan', 'Tamu Undangan & Sahabat', 'Umum'),
('ahmad-rizki-dan-keluarga', 'Ahmad Rizki & Keluarga', 'VIP'),
('siti-sarah', 'Siti Sarah', 'Teman'),
('budi-santoso', 'Budi Santoso', 'Keluarga')
on conflict (slug) do nothing;

insert into public.ucapan (nama, ucapan, kehadiran) values
('Budi Santoso', 'Barakallahu lakum wa baraka alaikum. Selamat ya bro Dani, mantap sekali akhirnya pelaminan!', 'hadir'),
('Siti Sarah', 'Happy wedding Rika sayang & kang Dani! Lancar-lancar acaranya ya. Maaf belum bisa hadir langsung tapi doa terbaik dari jauh.', 'tidak_hadir'),
('Ahmad Rizki & Keluarga', 'Selamat menempuh hidup baru Dani & Rika! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', 'hadir');
