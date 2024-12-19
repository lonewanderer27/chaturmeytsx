import { useQuery } from "@tanstack/react-query"
import client from "../../client"

const useStudentHobbies = (studentId?: string) => {
  const query = useQuery({
    queryKey: ["studentHobbies", studentId],
    queryFn: async() => {
      // fetch the hobbies
      const rawHobbies = await client
        .from("student_hobbies")
        .select("*, hobby:hobbies(*)")
        .eq("student_id", studentId!)

      if (!rawHobbies.data) return []

      // extract the hobbies from the raw data
      const hobbies = rawHobbies.data.map((hobby) => hobby.hobby)
      return hobbies
    },
    refetchOnMount: false,
    enabled: !!studentId
  })

  return query;
}

export default useStudentHobbies;