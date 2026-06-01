// ============================================
// Supabase Client Configuration (ESM Module)
// Husayn ProHerbal Medicine
// ============================================
// !!! IMPORTANT: Replace these with your own Supabase project credentials !!!
// Find them in your Supabase Dashboard: Project Settings > API

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://nnnmcmiihkgjivwkvmet.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubm1jbWlpaGtnaml2d2t2bWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDg0NDUsImV4cCI6MjA5NTE4NDQ0NX0.o2KDePXGODPDz1CAo9dfJd1Pb6OcVtSvO5W1omXsJSo';

// Initialize the Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabaseClient };
