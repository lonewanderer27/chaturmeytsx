import useSession from '../auth/useSession'
import { useQuery } from '@tanstack/react-query';
import client from '@/lib/client';

const useSelfStudent = () => {
  const { session } = useSession();

  const query = useQuery({
    queryKey: ['me_student'],
    queryFn: async () => {
      const res = await client
        .from("students")
        .select("*")
        .eq("profile_id", session?.user.id!)
        .single()

      return res.data;
    },
    enabled: session !== undefined
  })

  return query;
}

export default useSelfStudent