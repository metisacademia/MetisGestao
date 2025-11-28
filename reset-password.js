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

async function resetPassword() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('senha123', salt);
    
    const res = await pool.query('UPDATE "Usuario" SET senha_hash = $1 WHERE email = $2 RETURNING email', [hash, 'admin@metis.com']);
    
    if (res.rows.length > 0) {
      console.log('Password updated successfully for:', res.rows[0].email);
    } else {
      console.log('User admin@metis.com NOT found.');
    }
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    pool.end();
  }
}

resetPassword();
