import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from './types/client/supabase'
import { createClient } from '@supabase/supabase-js'

const client = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_API_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
    },
  },
)

export default client
