import { supabase } from '@/lib/supabase/client';
import { decodeSlug } from '@/lib/utils';
import InvitationCover from '@/components/invitation-cover';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let guestName = decodeSlug(slug);

  try {
    const { data } = await supabase
      .from('guests')
      .select('nama')
      .eq('slug', slug)
      .single();
    if (data?.nama) {
      guestName = data.nama;
    }
  } catch (e) {
    // Ignore error, fallback to decoded slug
  }

  return {
    title: `Undangan Spesial untuk ${guestName} - Dani & Rika`,
    description: `Halo ${guestName}, kami mengundang Anda untuk menghadiri pernikahan kami, Dani Ramdani & Rika Rahmawati pada 14 Juni 2026.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  let guestName = '';

  try {
    const { data, error } = await supabase
      .from('guests')
      .select('nama')
      .eq('slug', slug)
      .single();

    if (data && !error) {
      guestName = data.nama;
    } else {
      guestName = decodeSlug(slug);
    }
  } catch (error) {
    guestName = decodeSlug(slug);
  }

  return (
    <main className="relative min-h-screen bg-navy-dark overflow-hidden">
      <InvitationCover guestName={guestName} slug={slug} />
    </main>
  );
}
