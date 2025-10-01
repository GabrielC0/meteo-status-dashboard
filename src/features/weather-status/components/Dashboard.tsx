'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import Highcharts from 'highcharts';

import {
  getTitanCompanies,
  getTitanError,
  getTitanSessions,
  getTitanTicketsStats,
  useAppSelector,
} from '@/stores';
import type { TitanStatsProps } from '../types/Dashboard.types';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Layout from '@/components/layout/Layout';

import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const TitanStats = ({ stats }: TitanStatsProps) => {
  const items = [
    {
      label: 'Total connexions uniques',
      value: stats.uniqueConnections,
      variant: 'variantPrimary',
    },
    {
      label: 'Total connexions',
      value: stats.totalConnections,
      variant: 'variantCyan',
    },
    {
      label: 'Tickets nouveau',
      value: stats.ticketsNouveau,
      variant: 'variantSuccess',
    },
    {
      label: 'Tickets ouvert',
      value: stats.ticketsOuvert,
      variant: 'variantWarning',
    },
    {
      label: 'Tickets en attente',
      value: stats.ticketsEnAttente,
      variant: 'variantInfo',
    },
  ];

  return (
    <ErrorBoundary>
      <div className={styles.statsGrid}>
        {items.map((it) => (
          <div
            key={it.label}
            className={`${styles.statCard} ${styles[it.variant]}`}
            aria-label={it.label}
          >
            <div className={styles.statLabel}>{it.label}</div>
            <div className={styles.statValue}>{String(it.value)}</div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};

const TitanSection = () => {
  const enterprises = useAppSelector(getTitanCompanies);
  const sessions = useAppSelector(getTitanSessions);
  const ticketsStats = useAppSelector(getTitanTicketsStats);

  const chartContainerRef4 = useRef<HTMLDivElement | null>(null);
  const chartContainerRef5 = useRef<HTMLDivElement | null>(null);
  const zendeskLabelRef = useRef<Highcharts.SVGElement | null>(null);
  const chartContainerRef6 = useRef<HTMLDivElement | null>(null);
  const chartContainerRef7 = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!chartContainerRef4.current || topClientsPie.length === 0) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 450,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
      },
      title: {
        text: 'Top 15 clients',
        style: { color: '#ffffff', fontSize: '18px' },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: { color: '#ffffff', fontSize: '12px' },
          },
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
      },
      series: [
        {
          type: 'pie',
          name: 'Opérations',
          data: topClientsPie.map((item) => ({
            name: item.name,
            y: item.count,
          })),
        },
      ],
      credits: { enabled: false },
    };

    const chart = Highcharts.chart(chartContainerRef4.current, chartOptions);

    return () => {
      chart?.destroy();
    };
  }, [topClientsPie]);

  useEffect(() => {
    if (!chartContainerRef5.current || topUsers.length === 0) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 500,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        spacingRight: 10,
        spacingBottom: 10,
      },
      title: {
        text: 'Top 15 utilisateurs',
        style: { color: '#ffffff', fontSize: '18px' },
      },
      xAxis: {
        type: 'category',
        labels: {
          style: { fontSize: '12px', color: '#ffffff' },
        },
      },
      yAxis: {
        min: 0,
        title: { text: 'Opérations (nb)', style: { color: '#ffffff' } },
        labels: { style: { color: '#ffffff' } },
      },
      legend: { enabled: false },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            style: { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' },
          },
          borderWidth: 0,
          states: {
            hover: {
              enabled: false,
            },
            inactive: {
              enabled: false,
            },
          },
          enableMouseTracking: false,
        },
      },
      series: [
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
          data: topUsers.map((u) => [u.name, u.count]),
        },
      ],
      credits: { enabled: false },
    };

    const chart = Highcharts.chart(chartContainerRef5.current, chartOptions);

    return () => {
      chart?.destroy();
    };
  }, [topUsers]);

  useEffect(() => {
    if (!chartContainerRef6.current) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        height: 450,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        spacingRight: 10,
        spacingBottom: 10,
      },
      title: {
        text: 'Oracle - Sessions / CPU',
        style: { color: '#ffffff', fontSize: '18px' },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: { color: '#ffffff', fontSize: '12px' },
          format: '{value:%H:%M}',
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
      },
      yAxis: [
        {
          title: {
            text: 'Sessions actives',
            style: { color: '#10b981' },
          },
          labels: {
            style: { color: '#10b981' },
          },
          gridLineColor: 'rgba(255, 255, 255, 0.1)',
        },
        {
          title: {
            text: 'CPU (%)',
            style: { color: '#f59e0b' },
          },
          labels: {
            style: { color: '#f59e0b' },
            format: '{value}%',
          },
          opposite: true,
          gridLineColor: 'rgba(255, 255, 255, 0.05)',
        },
      ],
      legend: {
        enabled: true,
        itemStyle: { color: '#ffffff' },
      },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        style: { color: '#ffffff' },
        xDateFormat: '%d/%m/%Y %H:%M',
      },
      plotOptions: {
        spline: {
          animation: {
            duration: 1000,
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 5,
              },
            },
          },
          lineWidth: 2,
        },
      },
      series: [
        {
          type: 'spline',
          name: 'Sessions actives',
          yAxis: 0,
          data: oracleMetrics.timestamps.map((time, index) => [
            time,
            oracleMetrics.sessions[index],
          ]),
          color: '#10b981',
          animation: {
            duration: 1000,
          },
        },
        {
          type: 'spline',
          name: 'CPU (%)',
          yAxis: 1,
          data: oracleMetrics.timestamps.map((time, index) => [time, oracleMetrics.cpu[index]]),
          color: '#f59e0b',
          animation: {
            duration: 1000,
            defer: 500,
          },
        },
      ],
      credits: { enabled: false },
    };

    const chart = Highcharts.chart(chartContainerRef6.current, chartOptions);
    return () => {
      chart?.destroy();
    };
  }, [oracleMetrics]);

  useEffect(() => {
    if (!chartContainerRef7.current) return;

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 450,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        events: {
          render() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const chart = this;
            const series = chart.series[0];

            if (
              !series.center ||
              series.center[0] === undefined ||
              series.center[1] === undefined
            ) {
              return;
            }

            if (zendeskLabelRef.current) {
              zendeskLabelRef.current.destroy();
            }

            const centerX = series.center[0] + chart.plotLeft;
            const centerY = series.center[1] + chart.plotTop;

            const group = chart.renderer.g().add();

            chart.renderer
              .text('Total', 0, 0)
              .css({
                color: '#ffffff',
                fontSize: '14px',
                textAlign: 'center',
              })
              .attr({
                'text-anchor': 'middle',
              })
              .add(group);

            chart.renderer
              .text(String(zendeskTickets.total), 0, 30)
              .css({
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: 'bold',
                textAlign: 'center',
              })
              .attr({
                'text-anchor': 'middle',
              })
              .add(group);

            const groupBox = group.getBBox();

            group.attr({
              translateX: centerX - groupBox.width / 2 - groupBox.x,
              translateY: centerY - groupBox.height / 2 - groupBox.y,
            });

            zendeskLabelRef.current = group;
          },
        },
      },
      title: {
        text: 'Tickets Zendesk',
        style: { color: '#ffffff', fontSize: '18px' },
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> tickets ({point.percentage:.1f}%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        style: { color: '#ffffff' },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '75%',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.y} ({point.percentage:.1f}%)',
            style: { color: '#ffffff', fontSize: '13px', fontWeight: 'bold' },
          },
          showInLegend: true,
        },
      },
      legend: {
        enabled: true,
        itemStyle: { color: '#ffffff' },
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      series: [
        {
          type: 'pie',
          name: 'Tickets',
          data: zendeskTickets.data,
        },
      ],
      credits: { enabled: false },
    };

    const chart = Highcharts.chart(chartContainerRef7.current, chartOptions);

    return () => {
      chart?.destroy();
    };
  }, [zendeskTickets]);

  return (
    <ErrorBoundary>
      <section className={styles.section} aria-label="Section TITAN">
        <div className={styles.sectionHeader}>TITAN</div>
        <div className={styles.sectionBody}>
          <TitanStats stats={stats} />
          <div className={styles.chartsScrollContainer}>
            <div className={styles.chartCard}>
              <div ref={chartContainerRef4} style={{ minHeight: 450 }} />
            </div>
            <div className={styles.chartCard}>
              <div ref={chartContainerRef5} style={{ minHeight: 500 }} />
            </div>
            <div className={styles.chartCard}>
              <div ref={chartContainerRef6} style={{ minHeight: 450 }} />
            </div>
            <div className={styles.chartCard}>
              <div ref={chartContainerRef7} style={{ minHeight: 450 }} />
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

const MarketDataSection = () => {
  return (
    <ErrorBoundary>
      <section className={styles.section} aria-label="Section Données de marché">
        <div className={styles.sectionHeader}>Données de marché</div>
        <div className={styles.sectionBody}></div>
      </section>
    </ErrorBoundary>
  );
};

const Dashboard = () => {
  const titanError = useAppSelector(getTitanError);

  const error = titanError;

  return (
    <Layout title="Dashboard" hideHeader>
      <div className={styles.pageContainer}>
        {error && (
          <div className={styles.error} role="alert">
            <h2>Erreur de chargement</h2>
            <p>{error}</p>
          </div>
        )}
        <div className={styles.verticalSplit}>
          <MarketDataSection />
          <TitanSection />
        </div>
      </div>
    </Layout>
  );
};

Dashboard.displayName = 'WeatherStatus.Dashboard';
TitanStats.displayName = 'WeatherStatus.TitanStats';
TitanSection.displayName = 'WeatherStatus.TitanSection';
MarketDataSection.displayName = 'WeatherStatus.MarketDataSection';

export default memo(Dashboard);
