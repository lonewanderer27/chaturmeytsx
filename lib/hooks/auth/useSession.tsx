import client from '@/lib/client';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react'
import { router } from 'expo-router';

const useSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const logout = async () => {
    setLoading(true);
    await client.auth.signOut();
    setLoading(false);
    router.push('/(auth)/sign-in');
  }

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
    })

    const { data: { subscription: listener } } = client.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
    })

    return () => listener.unsubscribe();
  }, [])

  console.log("User ID: ", session?.user.id);

  return {
    session,
    logout,
    loading
  }
}

export default useSession