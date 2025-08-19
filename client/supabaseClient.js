import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rgrdfydlctgtsfcgqiom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncmRmeWRsY3RndHNmY2dxaW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDAwNTYsImV4cCI6MjA2MDcxNjA1Nn0.2RiuzxmI88cTjLWHFxmc97pfdT0lYeZPKhutv795Kfw';

export const supabase = createClient(supabaseUrl, supabaseKey);
