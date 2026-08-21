const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false }, global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) } });
async function run() { try { const { data, error } = await supabase.from('bids').select('*').limit(1); if (error) console.error('DB Error:', error); else console.log('DB Success'); } catch(e) { console.error('Exception:', e); } }
run();
