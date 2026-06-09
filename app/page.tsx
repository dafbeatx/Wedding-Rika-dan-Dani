import InvitationCover from '@/components/invitation-cover';

export default function Home() {
  // Direct direct access to the wedding cover page with a default visitor name
  return (
    <main className="relative min-h-screen bg-navy-dark overflow-hidden">
      <InvitationCover guestName="Tamu Undangan & Sahabat" slug="tamu-undangan" />
    </main>
  );
}
