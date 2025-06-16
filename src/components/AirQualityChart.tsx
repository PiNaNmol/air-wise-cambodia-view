
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ForecastData {
  time: string;
  aqi: number;
  pm25: number;
}

interface AirQualityChartProps {
  forecast: ForecastData[];
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({ forecast }) => {
  const chartData = forecast.map(item => {
    const date = new Date(item.time);
    return {
      time: date.getHours().toString().padStart(2, '0') + ':00',
      AQI: item.aqi,
      'PM2.5': item.pm25,
    };
  });

  const chartConfig = {
    AQI: {
      label: "Air Quality Index",
      color: "#3b82f6",
    },
    'PM2.5': {
      label: "PM2.5 (μg/m³)",
      color: "#ef4444",
    },
  };

  return (
    <div className="w-full h-80">
      <ChartContainer config={chartConfig}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="time" 
            tickLine={true}
            axisLine={true}
            className="text-xs"
            interval={2}
          />
          <YAxis 
            tickLine={true}
            axisLine={true}
            className="text-xs"
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <ChartTooltip 
            content={<ChartTooltipContent 
              formatter={(value, name) => [
                `${value}${name === 'PM2.5' ? ' μg/m³' : ''}`, 
                name
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />} 
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="AQI"
            stroke="var(--color-AQI)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-AQI)" }}
            activeDot={{ r: 6, fill: "var(--color-AQI)" }}
          />
          <Line
            type="monotone"
            dataKey="PM2.5"
            stroke="var(--color-PM2.5)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-PM2.5)" }}
            activeDot={{ r: 6, fill: "var(--color-PM2.5)" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AirQualityChart;
