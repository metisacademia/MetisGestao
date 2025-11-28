const { Pool } = require('pg');

// Corrected URL with dot instead of colon for user
const databaseUrl = "postgresql://postgres.ldxlabsliufepmtha:MensdeMente!@aws-0-us-west-2.pooler.supabase.com:6543/postgres";

console.log('Testing with corrected URL:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({ connectionString: databaseUrl });

pool.connect().then(client => {
  console.log('Connected successfully!');
  client.release();
  pool.end();
}).catch(err => {
  console.error('Connection error:', err);
  pool.end();
});
