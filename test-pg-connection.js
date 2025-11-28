const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let databaseUrl;
envContent.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    databaseUrl = line.split('=')[1].trim();
    // Remove quotes if present
    if (databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) {
      databaseUrl = databaseUrl.slice(1, -1);
    }
  }
});

console.log('DATABASE_URL found:', databaseUrl ? 'Yes' : 'No');
if (databaseUrl) {
  console.log('DATABASE_URL length:', databaseUrl.length);
  console.log('DATABASE_URL starts with:', databaseUrl.substring(0, 15) + '...');
}

try {
  console.log('Attempting to create Pool...');
  const pool = new Pool({ connectionString: databaseUrl });
  console.log('Pool created successfully.');
  
  // Try to connect (this might fail if DB is not reachable, but we want to see if parsing fails)
  pool.connect().then(client => {
    console.log('Connected successfully.');
    client.release();
    pool.end();
  }).catch(err => {
    console.error('Connection error:', err);
    pool.end();
  });

} catch (err) {
  console.error('Pool creation error:', err);
  if (err.stack) console.error(err.stack);
}
