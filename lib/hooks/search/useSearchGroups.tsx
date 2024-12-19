import client from "@/lib/client"
import { useQuery } from "@tanstack/react-query"

const useSearchGroups = (input?: string) => {
  const query = useQuery({
    queryKey: ['searchGroups', input],
    queryFn: async () => {
      const res = await client
        .from("groups")
        .select("*")
        .ilike("name", `%${input}%`)
        .limit(50)
        .order('created_at', { ascending: false })

      if (res.error || !res.data) return []
      return res.data;
    },
    refetchOnMount: false,
    enabled: !!input
  })

  return query;
}

export default useSearchGroups