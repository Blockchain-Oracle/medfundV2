import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema/*',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'medfund',
    port: Number(process.env.DB_PORT) || 5432,
  },
  verbose: true,
  strict: true,
} satisfies Config; 