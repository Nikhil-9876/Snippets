import {createClient} from '@supabase/supabase-js';
const supabaseUrl = "https://qfnxsvbxkmyhqgjhnvbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbnhzdmJ4a215aHFnamhudmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTQ0MzMsImV4cCI6MjA3NjU3MDQzM30.vQMSvae8X-DZE8oj8hpsJgXPG_bNLnQiPmdC7X1ZrOA";


export const supabase = createClient(supabaseUrl, supabaseAnonKey);