import mysql, { type PoolConnection } from 'mysql2/promise';

import type { PoolStats, QueryParams, PoolInternal } from '@/types/Database.types';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_DATABASE || 'dashboard-Data',
  user: process.env.DB_USER || 'meteo_user',
  password: process.env.DB_PASSWORD || 'meteo_pass',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
};

const pool = mysql.createPool(dbConfig);

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error);
    console.error('DB_HOST:', process.env.DB_HOST);
    console.error('DB_PORT:', process.env.DB_PORT);
    console.error('DB_DATABASE:', process.env.DB_DATABASE);
    console.error('DB_USER:', process.env.DB_USER);
    throw new Error(
      `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const query = async <T>(query: string, params?: QueryParams): Promise<T> => {
  try {
    const [results] = await pool.execute(query, params);
    // Type assertion needed: mysql2 returns a tuple of [results, fields]
    return results as T;
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution de la requête:", error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

export const transaction = async <T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>,
): Promise<T> => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};

export const getPoolStats = (): PoolStats => {
  // Required assertion: mysql2 does not expose the internal pool types
  const poolInternal = pool.pool as PoolInternal;
  return {
    totalConnections: poolInternal._allConnections?.length ?? 0,
    freeConnections: poolInternal._freeConnections?.length ?? 0,
    queueLength: poolInternal._connectionQueue?.length ?? 0,
  };
};

export default pool;
