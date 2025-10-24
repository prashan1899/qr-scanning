const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL ;
const supabaseKey = process.env.SUPABASE_KEY ;
const supabase = createClient(supabaseUrl, supabaseKey);

supabase
  .from('BUILDING')
  .select('*')
  .limit(1)
  .then(() => console.log('Connected to Supabase database'))
  .catch(err => console.error('Supabase connection error:', err.message));

module.exports = supabase;