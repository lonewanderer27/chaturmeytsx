import { useQuery } from '@tanstack/react-query'
import client from '../../client'

const useStudent = (studentId: string) => {
  const query = useQuery({
    queryKey: ["student", studentId],
    queryFn: async() => {
      const res = await client
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single()

      return res.data
    }
  })

  return query;
}

export default useStudent