import client from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

const useStudentGroups = (studentId?: string) => {
  const query = useQuery({
    queryKey: ["studentGroups", studentId],
    queryFn: async () => {
      // Get the groups that the student is a member of
      const res = await client
      .from("group_members")
      .select("*, group:group_id(*)")
      .eq("student_id", studentId!)
      
      if (res.error) {
        return [];
      }

      // extract the group profiles from the groups
      const groups = res.data!.map((group) => group.group);
      console.log("student groups", groups);
      return groups;
    },
    refetchOnMount: false,
    enabled: !!studentId,
  });

  return query;
}

export default useStudentGroups;