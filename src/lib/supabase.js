import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zzuitudodcuoxemodsni.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWl0dWRvZGN1b3hlbW9kc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzgzNDYsImV4cCI6MjA5ODA1NDM0Nn0.RYlqOTCNtPKIMYLG5TCmZYBrxx0fHBv4GUfDWaL4nH0'

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY)
