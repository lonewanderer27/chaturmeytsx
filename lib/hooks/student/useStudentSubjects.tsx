import { useQuery } from '@tanstack/react-query'
import client from '../../client'

const useStudentSubjects = (studentId?: string) => {
  const query = useQuery({
    queryKey: ["studentSubjects", studentId],
    queryFn: async () => {
      // fetch the ids of the subjects
      const rawSubjects = await client
        .from("students_subjects")
        .select("*, subject:subjects(*)")
        .eq("student_id", studentId!)

      if (!rawSubjects.data || rawSubjects.error) return []

      // extract the subjects from the raw data
      const subjects = rawSubjects.data.map((subject) => subject.subject)
      return subjects;
    },
    refetchOnMount: false,
    enabled: !!studentId
  })

  return query;
}

export default useStudentSubjects