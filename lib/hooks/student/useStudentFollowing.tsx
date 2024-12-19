import { useQuery } from '@tanstack/react-query'
import client from '../../client'

const useStudentFollowing = (studentId?: string) => {
  const query = useQuery({
    queryKey: ["studentFollowings", studentId],
    queryFn: async() => {
      // fetch the following ids
      const followingRes = await client
        .from("student_followers")
        .select("*, student:students!student_followers_following_id_fkey(*)")
        .eq("follower_id", studentId!)

      if (followingRes.error) {
        return [];
      }

      // extract the student profiles from the followings
      const students = followingRes.data!.map((followings) => followings.student);
      console.log("following students", students);
      return students;
    },
    refetchOnMount: false,
    enabled: !!studentId,
  })

  return query;
}

export default useStudentFollowing