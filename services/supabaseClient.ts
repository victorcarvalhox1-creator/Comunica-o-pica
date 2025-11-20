
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhuruvzihszgplbnduho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odXJ1dnppaHN6Z3BsYm5kdWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTc3OTMsImV4cCI6MjA3OTE5Mzc5M30.0Gp6sx9v_owwlwmX-qjpAtR3DCwXP-o_e6WzzjWM8dc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
