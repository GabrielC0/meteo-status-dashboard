'use client';

import { memo, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

import type { ChartWrapperProps } from '@/types/ChartWrapper.types';

import ErrorBoundary from './ErrorBoundary';

import styles from '@/styles/components/ui/ChartWrapper.module.scss';

const ChartWrapper = ({
  type,
  title,
  series,
  height = 400,
  categories,
  yAxis,
  showLegend = false,
  showBorder = true,
  borderColor = 'rgba(255, 255, 255, 0.3)',
  backgroundColor = 'transparent',
  colors,
  enableAnimation = true,
  animationDuration = 1000,
  showDataLabels = true,
  dataLabelFormat,
  dataLabelRotation,
  xAxisType = 'category',
  xAxisFormat,
  xAxisRotation,
  tooltipFormat,
  onRenderComplete,
  centerLabel,
}: ChartWrapperProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const buildYAxisConfig = (): Highcharts.YAxisOptions | Highcharts.YAxisOptions[] => {
      if (!yAxis) {
        return {
          min: 0,
          title: { text: '', style: { color: '#ffffff' } },
          labels: { style: { color: '#ffffff' } },
        };
      }

      if (Array.isArray(yAxis)) {
        return yAxis.map((axis, index) => ({
          min: axis.min ?? 0,
          title: {
            text: axis.title,
            style: { color: axis.titleColor || '#ffffff' },
          },
          labels: {
            style: { color: axis.labelColor || '#ffffff' },
            format: axis.format,
          },
          opposite: axis.opposite ?? index > 0,
          gridLineColor: 'rgba(255, 255, 255, 0.1)',
        }));
      }

      return {
        min: yAxis.min ?? 0,
        title: {
          text: yAxis.title,
          style: { color: yAxis.titleColor || '#ffffff' },
        },
        labels: {
          style: { color: yAxis.labelColor || '#ffffff' },
          format: yAxis.format,
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
      };
    };

    const buildXAxisConfig = (): Highcharts.XAxisOptions => {
      const config: Highcharts.XAxisOptions = {
        type: xAxisType,
        labels: {
          style: { color: '#ffffff', fontSize: '12px' },
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
      };

      if (categories) {
        config.categories = categories;
      }

      if (xAxisRotation !== undefined) {
        config.labels = {
          ...config.labels,
          rotation: xAxisRotation,
        };
      }

      if (xAxisFormat) {
        config.labels = {
          ...config.labels,
          format: xAxisFormat,
        };
      }

      return config;
    };

    const buildPlotOptions = (): Highcharts.PlotOptions => {
      const baseDataLabels = {
        enabled: showDataLabels,
        style: { color: '#ffffff', fontSize: '12px', fontWeight: 'bold' },
        format: dataLabelFormat,
        rotation: dataLabelRotation,
      };

      const plotOptions: Highcharts.PlotOptions = {};

      switch (type) {
        case 'pie':
          plotOptions.pie = {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: baseDataLabels,
            showInLegend: showLegend,
          };
          break;
        case 'column':
          plotOptions.column = {
            dataLabels: baseDataLabels,
            borderWidth: 0,
          };
          break;
        case 'bar':
          plotOptions.bar = {
            dataLabels: baseDataLabels,
            borderWidth: 0,
          };
          break;
        case 'spline':
        case 'line':
          plotOptions.spline = {
            animation: enableAnimation ? { duration: animationDuration } : false,
            marker: {
              enabled: false,
              states: { hover: { enabled: true, radius: 5 } },
            },
            lineWidth: 2,
          };
          break;
      }

      return plotOptions;
    };

    const chartOptions: Highcharts.Options = {
      chart: {
        type,
        backgroundColor,
        height,
        borderWidth: showBorder ? 1 : 0,
        borderColor: showBorder ? borderColor : undefined,
        borderRadius: 8,
        spacingRight: 10,
        spacingBottom: 10,
        events: onRenderComplete
          ? {
              render() {
                onRenderComplete();
              },
            }
          : undefined,
      },
      title: {
        text: title,
        style: { color: '#ffffff', fontSize: '18px' },
      },
      xAxis: buildXAxisConfig(),
      yAxis: buildYAxisConfig(),
      legend: {
        enabled: showLegend,
        itemStyle: { color: '#ffffff' },
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      tooltip: {
        pointFormat: tooltipFormat || '<b>{point.y:.0f}</b>',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        style: { color: '#ffffff' },
      },
      plotOptions: buildPlotOptions(),
      //Highcharts series type inference limitation
      series: series.map((s) => ({
        ...s,
        type: s.type || type,
        colors: s.colors || colors,
      })) as Highcharts.SeriesOptionsType[],
      credits: { enabled: false },
    };

    const chart = Highcharts.chart(chartContainerRef.current, chartOptions);

    if (type === 'pie' && chart && centerLabel?.enabled) {
      const renderCenter = () => {
        const cx = chart.plotLeft + chart.plotWidth / 2;
        const cy = chart.plotTop + chart.plotHeight / 2;
        const existing = chart.container.querySelector('g[data-center-group="1"]');

        if (existing && existing.parentNode) {
          existing.parentNode.removeChild(existing);
        }

        const group = chart.renderer.g().attr({ 'data-center-group': '1' }).add();

        chart.renderer
          .text(centerLabel.title, 0, 0)
          .css({ color: '#ffffff', fontSize: '14px', textAlign: 'center' })
          .attr({ 'text-anchor': 'middle' })
          .add(group);

        chart.renderer
          .text(String(centerLabel.value), 0, 26)
          .css({ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', textAlign: 'center' })
          .attr({ 'text-anchor': 'middle' })
          .add(group);

        const box = group.getBBox();

        group.attr({
          translateX: cx - box.width / 2 - box.x,
          translateY: cy - box.height / 2 - box.y,
        });
      };

      renderCenter();
      Highcharts.addEvent(chart, 'render', renderCenter);
    }

    return () => {
      chart?.destroy();
    };
  }, [
    type,
    title,
    series,
    height,
    categories,
    yAxis,
    showLegend,
    showBorder,
    borderColor,
    backgroundColor,
    colors,
    enableAnimation,
    animationDuration,
    showDataLabels,
    dataLabelFormat,
    dataLabelRotation,
    xAxisType,
    xAxisFormat,
    xAxisRotation,
    tooltipFormat,
    onRenderComplete,
    centerLabel,
  ]);

  return (
    <ErrorBoundary>
      <div
        ref={chartContainerRef}
        className={styles.chartWrapper__container}
        style={{ minHeight: `${height}px` }}
      />
    </ErrorBoundary>
  );
};

ChartWrapper.displayName = 'Ui.ChartWrapper';

export default memo(ChartWrapper);
