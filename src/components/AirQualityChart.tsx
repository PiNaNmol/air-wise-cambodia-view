
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ForecastData {
  time: string;
  aqi: number;
  pm25: number;
}

interface AirQualityChartProps {
  forecast: ForecastData[];
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({ forecast }) => {
  const chartData = forecast.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    aqi: item.aqi,
    pm25: item.pm25,
  }));

  const chartConfig = {
    aqi: {
      label: "AQI",
      color: "#3b82f6",
    },
    pm25: {
      label: "PM2.5",
      color: "#ef4444",
    },
  };

  return (
    <div className="w-full h-64">
      <ChartContainer config={chartConfig}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="time" 
            tickLine={false}
            axisLine={false}
            className="text-xs"
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            className="text-xs"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="var(--color-aqi)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="pm25"
            stroke="var(--color-pm25)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AirQualityChart;
