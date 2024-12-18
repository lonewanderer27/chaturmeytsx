import useSession from '../auth/useSession';
import { useQuery } from '@tanstack/react-query';
import client from '../../client';

const useSelfStudentLite = () => {
  const { session } = useSession();

  const query = useQuery({
    queryKey: ['student', 'lite'],
    queryFn: async () => {
      const res = await client
        .from("students")
        .select("*")
        .eq("profile_id", session?.user.id!)
        .single();

      return res.data;
    },
    enabled: !!session,
  })

  return {
    student: query.data ?? null,
    query
  }
}

export default useSelfStudentLite;