export type ChartType = 'pie' | 'column' | 'bar' | 'spline' | 'line' | 'area';

export type ChartDataPoint = {
  name?: string;
  y: number;
  color?: string;
};

export type ChartSeries = {
  name: string;
  data: ChartDataPoint[] | [string | number, number][];
  type?: ChartType;
  yAxis?: number;
  color?: string;
  innerSize?: string;
  colors?: string[];
  colorByPoint?: boolean;
};

export type YAxisConfig = {
  title: string;
  titleColor?: string;
  labelColor?: string;
  opposite?: boolean;
  min?: number;
  format?: string;
};

export type ChartWrapperProps = {
  type: ChartType;
  title: string;
  series: ChartSeries[];
  height?: number;
  categories?: string[];
  yAxis?: YAxisConfig | YAxisConfig[];
  showLegend?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  colors?: string[];
  enableAnimation?: boolean;
  animationDuration?: number;
  showDataLabels?: boolean;
  dataLabelFormat?: string;
  dataLabelRotation?: number;
  xAxisType?: 'category' | 'datetime' | 'linear';
  xAxisFormat?: string;
  xAxisRotation?: number;
  tooltipFormat?: string;
  onRenderComplete?: () => void;
};
