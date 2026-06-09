import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { decodeSlug } from '@/lib/utils';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// OG metadata so WhatsApp/Telegram shows thumbnail even on shortlink
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
  const pageTitle = `Undangan Pernikahan Dani & Rika 💍`;
  const pageDescription = `Halo ${guestName}, Anda diundang ke pernikahan Dani Ramdani & Rika Rahmawati pada 14 Juni 2026.`;

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

// Redirect shortlink /i/[slug] → /invitation/[slug]
export default async function ShortLinkPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/invitation/${slug}`);
}
