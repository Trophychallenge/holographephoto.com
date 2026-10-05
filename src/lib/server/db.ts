import { env } from '$env/dynamic/private';
import { Pool, type PoolClient } from '@neondatabase/serverless';

export type DatabaseClient = PoolClient;

function getDatabaseUrl() {
	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
	return env.DATABASE_URL;
}

export async function withDatabaseTransaction<T>(callback: (client: DatabaseClient) => Promise<T>) {
	const pool = new Pool({ connectionString: getDatabaseUrl() });
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await callback(client);
		await client.query('COMMIT');
		return result;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
		await pool.end();
	}
}

export async function withDatabaseClient<T>(callback: (client: DatabaseClient) => Promise<T>) {
	const pool = new Pool({ connectionString: getDatabaseUrl() });
	const client = await pool.connect();

	try {
		return await callback(client);
	} finally {
		client.release();
		await pool.end();
	}
}
