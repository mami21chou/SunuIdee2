const supabaseUrl = import.meta.env.VITE_supabaseUrl
const supabaseKey = import.meta.env.VITE_supabaseKey
import { createClient } from "@supabase/supabase-js"
export const supabase = createClient(supabaseUrl, supabaseKey)
