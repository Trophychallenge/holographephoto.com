import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/inventory-schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? ''
	}
});
