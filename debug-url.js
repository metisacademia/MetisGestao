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

console.log('Testing URL parsing for:', databaseUrl.substring(0, 20) + '...');

try {
  const url = new URL(databaseUrl);
  console.log('URL parsed successfully!');
  console.log('Protocol:', url.protocol);
  console.log('Hostname:', url.hostname);
  console.log('Port:', url.port);
  console.log('Pathname:', url.pathname);
  console.log('SearchParams:', url.searchParams.toString());
} catch (err) {
  console.error('URL parsing failed:', err);
}
