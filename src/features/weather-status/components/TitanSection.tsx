'use client';

import { memo, useMemo } from 'react';

import {
  getTitanCompanies,
  getTitanSessions,
  getTitanTicketsStats,
  useAppSelector,
} from '@/stores';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ChartWrapper from '@/components/ui/ChartWrapper';
import TitanStats from './TitanStats';

import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const TitanSection = () => {
  const enterprises = useAppSelector(getTitanCompanies);
  const sessions = useAppSelector(getTitanSessions);
  const ticketsStats = useAppSelector(getTitanTicketsStats);

  const { stats, topClientsPie, topUsers, oracleMetrics, zendeskTickets } = useMemo(() => {
    const uniqueEnterprises = new Set<string>();
    const countsAll: Record<string, number> = {};

    for (const e of enterprises) {
      uniqueEnterprises.add(e.name);
      countsAll[e.name] = (countsAll[e.name] || 0) + e.operations.length;
    }

    const totalConnections = enterprises.reduce((sum, e) => sum + e.operations.length, 0);

    const topClientsPieData = Object.entries(countsAll)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    const topUsersData = Object.entries(countsAll)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    const timestamps = sessions.map((s) => new Date(s.timestamp).getTime());
    const oracleSessions = sessions.map((s) => s.active_sessions);
    const oracleCPU = sessions.map((s) => s.cpu_usage_percent);

    const ticketNouveau = Number(ticketsStats?.tickets_nouveau) || 0;
    const ticketOuvert = Number(ticketsStats?.tickets_ouvert) || 0;
    const ticketEnAttente = Number(ticketsStats?.tickets_en_attente) || 0;
    const totalTickets = ticketOuvert + ticketNouveau + ticketEnAttente;

    return {
      stats: {
        uniqueConnections: uniqueEnterprises.size,
        totalConnections,
        ticketsNouveau: ticketNouveau,
        ticketsOuvert: ticketOuvert,
        ticketsEnAttente: ticketEnAttente,
      },
      topClientsPie: topClientsPieData,
      topUsers: topUsersData,
      oracleMetrics: {
        timestamps,
        sessions: oracleSessions,
        cpu: oracleCPU,
      },
      zendeskTickets: {
        total: totalTickets,
        data: [
          { name: 'Ouvert', y: ticketOuvert, color: '#f59e0b' },
          { name: 'Nouveau', y: ticketNouveau, color: '#22c55e' },
          { name: 'En attente', y: ticketEnAttente, color: '#3b82f6' },
        ],
      },
    };
  }, [enterprises, sessions, ticketsStats]);

  return (
    <ErrorBoundary>
      <section className={styles.section} aria-label="Section TITAN">
        <div className={styles.sectionHeader}>TITAN</div>
        <div className={styles.sectionBody}>
          <TitanStats stats={stats} />
          <div className={styles.chartsScrollContainer}>
            <div className={styles.chartCard}>
              <ChartWrapper
                type="pie"
                title="Top 15 clients"
                series={[
                  {
                    type: 'pie',
                    name: 'Opérations',
                    data: topClientsPie.map((item) => ({ name: item.name, y: item.count })),
                    colors: [
                      '#10b981',
                      '#14b8a6',
                      '#06b6d4',
                      '#0ea5e9',
                      '#3b82f6',
                      '#6366f1',
                      '#8b5cf6',
                      '#a855f7',
                      '#d946ef',
                      '#ec4899',
                      '#f43f5e',
                      '#ef4444',
                      '#f97316',
                      '#f59e0b',
                      '#eab308',
                    ],
                  },
                ]}
                height={450}
                showDataLabels={true}
                dataLabelFormat="<b>{point.name}</b>: {point.percentage:.1f}%"
                showLegend={false}
                showBorder={true}
                borderColor="rgba(255, 255, 255, 0.3)"
              />
            </div>
            <div className={styles.chartCard}>
              <ChartWrapper
                type="bar"
                title="Top 15 utilisateurs"
                series={[
                  {
                    type: 'bar',
                    name: 'Utilisateurs',
                    colorByPoint: true,
                    colors: [
                      '#10b981',
                      '#14b8a6',
                      '#06b6d4',
                      '#0ea5e9',
                      '#3b82f6',
                      '#6366f1',
                      '#8b5cf6',
                      '#a855f7',
                      '#d946ef',
                      '#ec4899',
                      '#f43f5e',
                      '#ef4444',
                      '#f97316',
                      '#f59e0b',
                      '#eab308',
                    ],
                    data: topUsers.map((u) => ({ name: u.name, y: u.count })),
                  },
                ]}
                height={500}
                showLegend={false}
                showDataLabels={true}
              />
            </div>
            <div className={styles.chartCard}>
              <ChartWrapper
                type="spline"
                title="Oracle - Sessions / CPU"
                series={[
                  {
                    type: 'spline',
                    name: 'Sessions actives',
                    yAxis: 0,
                    color: '#10b981',
                    data: oracleMetrics.timestamps.map((time, index) => ({
                      x: time,
                      y: oracleMetrics.sessions[index],
                    })),
                  },
                  {
                    type: 'spline',
                    name: 'CPU (%)',
                    yAxis: 1,
                    color: '#f59e0b',
                    data: oracleMetrics.timestamps.map((time, index) => ({
                      x: time,
                      y: oracleMetrics.cpu[index],
                    })),
                  },
                ]}
                height={450}
                xAxisType="datetime"
                xAxisFormat="{value:%H:%M}"
                yAxis={[
                  { title: 'Sessions actives', titleColor: '#10b981', labelColor: '#10b981' },
                  {
                    title: 'CPU (%)',
                    titleColor: '#f59e0b',
                    labelColor: '#f59e0b',
                    opposite: true,
                    format: '{value}%',
                  },
                ]}
                showLegend={true}
              />
            </div>
            <div className={styles.chartCard}>
              <ChartWrapper
                type="pie"
                title="Tickets Zendesk"
                series={[
                  {
                    type: 'pie',
                    name: 'Tickets',
                    innerSize: '75%',
                    data: zendeskTickets.data,
                  },
                ]}
                height={450}
                showLegend={true}
                showDataLabels={true}
                dataLabelFormat="<b>{point.name}</b><br>{point.y} ({point.percentage:.1f}%)"
                tooltipFormat="<b>{point.y}</b> tickets ({point.percentage:.1f}%)"
                centerLabel={{ title: 'Total', value: zendeskTickets.total, enabled: true }}
              />
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

TitanSection.displayName = 'WeatherStatus.TitanSection';

export default memo(TitanSection);
