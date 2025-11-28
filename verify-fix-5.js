const { Pool } = require('pg');

// Hypothesis 5: Project ref from .env.example
const databaseUrl = "postgresql://postgres.ldxlaosblisuffepmtha:MensdeMente!@aws-0-us-west-2.pooler.supabase.com:6543/postgres";

console.log('Testing with project ref from example:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({ connectionString: databaseUrl });

pool.connect().then(client => {
  console.log('Connected successfully!');
  client.release();
  pool.end();
}).catch(err => {
  console.error('Connection error:', err);
  pool.end();
});
