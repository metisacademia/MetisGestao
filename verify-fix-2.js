const { Pool } = require('pg');

// Hypothesis 2: Direct connection URL
const databaseUrl = "postgresql://postgres:MensdeMente!@db.ldxlabsliufepmtha.supabase.co:5432/postgres";

console.log('Testing with direct connection URL:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({ connectionString: databaseUrl });

pool.connect().then(client => {
  console.log('Connected successfully!');
  client.release();
  pool.end();
}).catch(err => {
  console.error('Connection error:', err);
  pool.end();
});
