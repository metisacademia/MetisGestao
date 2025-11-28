const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = `# Supabase PostgreSQL connection string (use the pooled connection URL for serverless/Vercel)
DATABASE_URL="postgresql://postgres.ldxlaosblisuffepmtha:MensdeMente!@aws-0-us-west-2.pooler.supabase.com:6543/postgres"

# Secret key for JWT authentication
JWT_SECRET=MetisGestaoKyklos2025
`;

fs.writeFileSync(envPath, content);
console.log('.env updated successfully');
