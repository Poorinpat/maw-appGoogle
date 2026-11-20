import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://dkfgwmswrzbnvicxqiti.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_eIGCHdiA9GqDPbtmWeDU7w_gthlDKq1';

export const supabase = createClient(supabaseUrl, supabaseKey);
