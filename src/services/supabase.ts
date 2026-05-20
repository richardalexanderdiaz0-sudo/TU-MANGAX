import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ufjrytjimaivkwafefax.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_be4tQg9S4fmfIWjyOP6Pqg_pJyx2Nrm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
