import { Analyzer } from '@/components/Analyzer';
import { Landing } from '@/components/Landing';
import { UserBar } from '@/components/UserBar';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  // Logged out -> public landing. Logged in -> the analyzer.
  if (!claims) return <Landing />;

  return (
    <>
      <UserBar email={(claims.email as string) ?? ''} />
      <Analyzer userId={(claims.sub as string) ?? ''} />
    </>
  );
}
