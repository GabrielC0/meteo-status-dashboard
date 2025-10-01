import type { PoolConnection } from 'mysql2/promise';

export type PoolInternal = {
  _allConnections?: PoolConnection[];
  _freeConnections?: PoolConnection[];
  _connectionQueue?: PoolConnection[];
};

export type PoolStats = {
  totalConnections: number;
  freeConnections: number;
  queueLength: number;
};

export type QueryParams = (string | number | boolean | Date | null)[];
