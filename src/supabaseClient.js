import { createClient } from '@supabase/supabase-js'

// Estas variables leen los datos de tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Aquí exportamos la conexión para que App.jsx la pueda usar
export const supabase = createClient(supabaseUrl, supabaseKey)