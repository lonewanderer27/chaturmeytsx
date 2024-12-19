import React from 'react'
import useSelfStudent from './useSelfStudent'
import { useQuery } from '@tanstack/react-query';
import client from '@/lib/client';

const useSelfSearchHistory = () => {
  const { data: student } = useSelfStudent();
  const query = useQuery({
    queryKey: ['selfSearchHistory'],
    queryFn: async () => {
      const res = await client
        .from("search_history")
        .select("*")
        .eq("hide", false)
        .eq("student_id", student?.id!)
        .limit(20)
        .order("created_at", { ascending: false });
      if (res.error || !res.data) return []

      return res.data;
    },
    enabled: !!student?.id
  })

  return query;
}

export default useSelfSearchHistory