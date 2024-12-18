import useSelfStudentLite from "./useSelfStudentLite";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const useSelfFollowing = () => {
  const { student } = useSelfStudentLite();

  // fetch the student profiles of the followings
  const followingsQuery = useQuery({
    queryKey: ["student", student?.id, "followings"],
    queryFn: async () => {
      const res = await client
        .from("student_followers")
        .select("*, student:students!student_followers_following_id_fkey(*)")
        .eq("follower_id", student!.id);

      if (res.error) {
        return [];
      }

      // extract the student profiles from the followings
      const students = res.data!.map((followings) => followings.student);
      console.log("following students", students);
      return students;
    },
    refetchOnMount: false,
    enabled: !!student,
  });

  return followingsQuery;
};

export default useSelfFollowing;
