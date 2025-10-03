import { query } from './config';
import type {
  TitanService,
  TitanServiceRow,
  TitanSession,
  TitanSessionRow,
} from '@/types/Titan.types';

const mapServiceType = (value: string): TitanService['service_type'] => {
  switch (value) {
    case 'API':
    case 'AUTH':
    case 'DATABASE':
    case 'CACHE':
      return value;
    default:
      return 'OTHER';
  }
};

const mapServiceStatus = (value: string): TitanService['status'] => {
  switch (value) {
    case 'operational':
    case 'degraded':
    case 'outage':
    case 'maintenance':
      return value;
    default:
      return 'operational';
  }
};

const parseDependencies = (raw: string | null): string[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : null;
  } catch {
    return null;
  }
};

export const getAllServices = async (): Promise<TitanService[]> => {
  try {
    const services = await query<TitanServiceRow[]>(
      `SELECT 
        id, service_code, service_name, service_type, status,
        uptime_percentage, last_check, response_time_ms, description, dependencies
      FROM titan_services
      ORDER BY service_name ASC`,
    );

    return services.map((s) => ({
      id: s.id,
      service_code: s.service_code,
      service_name: s.service_name,
      service_type: mapServiceType(s.service_type),
      status: mapServiceStatus(s.status),
      uptime_percentage: Number(s.uptime_percentage),
      last_check: s.last_check.toISOString(),
      response_time_ms: s.response_time_ms,
      description: s.description,
      dependencies: parseDependencies(s.dependencies),
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des services TITAN:', error);
    throw error;
  }
};

export const getSessionMetrics = async (hours = 24): Promise<TitanSession[]> => {
  try {
    const sessions = await query<TitanSessionRow[]>(
      `SELECT 
        id, timestamp, active_sessions, cpu_usage_percent, memory_usage_mb
      FROM titan_sessions
      WHERE timestamp >= NOW() - INTERVAL ? HOUR
      ORDER BY timestamp ASC`,
      [hours],
    );

    return sessions.map((s) => ({
      id: s.id,
      timestamp: s.timestamp.toISOString(),
      active_sessions: s.active_sessions,
      cpu_usage_percent: Number(s.cpu_usage_percent),
      memory_usage_mb: s.memory_usage_mb,
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sessions:', error);
    throw error;
  }
};

export const addSessionMetric = async (
  activeSessions: number,
  cpuUsagePercent: number,
  memoryUsageMb?: number,
): Promise<boolean> => {
  try {
    await query(
      `INSERT INTO titan_sessions 
        (timestamp, active_sessions, cpu_usage_percent, memory_usage_mb)
      VALUES (NOW(), ?, ?, ?)`,
      [activeSessions, cpuUsagePercent, memoryUsageMb || null],
    );
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la métrique:", error);
    return false;
  }
};

export const updateServiceStatus = async (
  serviceCode: string,
  status: TitanService['status'],
  responseTimeMs?: number,
): Promise<boolean> => {
  try {
    await query(
      `UPDATE titan_services
      SET status = ?, 
          last_check = NOW(),
          response_time_ms = COALESCE(?, response_time_ms),
          updated_at = NOW()
      WHERE service_code = ?`,
      [status, responseTimeMs || null, serviceCode],
    );
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du service ${serviceCode}:`, error);
    return false;
  }
};

export const getTitanStats = async () => {
  try {
    const [serviceStats] = await query<
      {
        total_services: number;
        services_operational: number;
        services_degraded: number;
        services_outage: number;
        avg_uptime: number;
      }[]
    >(
      `SELECT 
        COUNT(*) as total_services,
        SUM(CASE WHEN status = 'operational' THEN 1 ELSE 0 END) as services_operational,
        SUM(CASE WHEN status = 'degraded' THEN 1 ELSE 0 END) as services_degraded,
        SUM(CASE WHEN status = 'outage' THEN 1 ELSE 0 END) as services_outage,
        AVG(uptime_percentage) as avg_uptime
      FROM titan_services`,
    );

    const [sessionStats] = await query<
      {
        avg_cpu: number;
        max_cpu: number;
        avg_sessions: number;
        max_sessions: number;
      }[]
    >(
      `SELECT 
        AVG(cpu_usage_percent) as avg_cpu,
        MAX(cpu_usage_percent) as max_cpu,
        AVG(active_sessions) as avg_sessions,
        MAX(active_sessions) as max_sessions
      FROM titan_sessions
      WHERE timestamp >= NOW() - INTERVAL 1 HOUR`,
    );

    return {
      services: serviceStats || {
        total_services: 0,
        services_operational: 0,
        services_degraded: 0,
        services_outage: 0,
        avg_uptime: 0,
      },
      sessions: sessionStats || {
        avg_cpu: 0,
        max_cpu: 0,
        avg_sessions: 0,
        max_sessions: 0,
      },
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats TITAN:', error);
    throw error;
  }
};

const titanService = {
  getAllServices,
  getSessionMetrics,
  addSessionMetric,
  updateServiceStatus,
  getTitanStats,
};

export default titanService;
