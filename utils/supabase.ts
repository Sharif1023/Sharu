
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygupgkkmzokcnszbvyvi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndXBna2ttem9rY25zemJ2eXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTE2MzcsImV4cCI6MjA4NDQ4NzYzN30.EtmlOxDWEqKIMUKGdyXlomPKVKHATtV8WeDldGOaijc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
