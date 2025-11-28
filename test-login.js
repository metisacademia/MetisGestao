const login = async () => {
  try {
    console.log('Attempting login with admin@metis.com...');
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@metis.com', senha: 'senha123' }),
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

login();
