// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@metis.com', senha: 'senha123' }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Body:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
