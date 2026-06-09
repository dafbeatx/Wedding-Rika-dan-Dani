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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wedding-rika-dan-dani.vercel.app');
  const ogImageUrl = `${baseUrl}/og-wedding.jpg`;
  const pageTitle = `Undangan Spesial untuk ${guestName} - Dani & Rika`;
  const pageDescription = `Halo ${guestName}, kami mengundang Anda untuk menghadiri pernikahan kami, Dani Ramdani & Rika Rahmawati pada 14 Juni 2026.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Pernikahan Dani & Rika',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
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
