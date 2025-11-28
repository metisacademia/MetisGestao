const { Pool } = require('pg');

// Hypothesis 3: Encoded colon in user
const databaseUrl = "postgresql://postgres%3Aldxlabsliufepmtha:MensdeMente!@aws-0-us-west-2.pooler.supabase.com:6543/postgres";

console.log('Testing with encoded user:', databaseUrl.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({ connectionString: databaseUrl });

pool.connect().then(client => {
  console.log('Connected successfully!');
  client.release();
  pool.end();
}).catch(err => {
  console.error('Connection error:', err);
  pool.end();
});
