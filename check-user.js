const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let databaseUrl;
envContent.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    databaseUrl = line.split('=')[1].trim();
    if (databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) {
      databaseUrl = databaseUrl.slice(1, -1);
    }
  }
});

const pool = new Pool({ connectionString: databaseUrl });

async function checkUser() {
  try {
    const res = await pool.query('SELECT * FROM "Usuario" WHERE email = $1', ['admin@metis.com']);
    if (res.rows.length > 0) {
      console.log('User found:', res.rows[0].email);
      const user = res.rows[0];
      const validPassword = await bcrypt.compare('senha123', user.senha_hash);
      console.log('Password valid:', validPassword);
    } else {
      console.log('User admin@metis.com NOT found.');
    }
  } catch (err) {
    console.error('Error checking user:', err);
  } finally {
    pool.end();
  }
}

checkUser();
