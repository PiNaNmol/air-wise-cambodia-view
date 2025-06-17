
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ForecastData {
  time: string;
  aqi: number;
  pm25: number;
}

interface AirQualityChartProps {
  forecast: ForecastData[];
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({ forecast }) => {
  // Get current and future data points
  const currentAQI = forecast[0]?.aqi || 0;
  const futureAQI = forecast[forecast.length - 1]?.aqi || 0;
  const trend = futureAQI > currentAQI ? 'up' : futureAQI < currentAQI ? 'down' : 'stable';
  
  // Calculate average AQI for next 24 hours
  const avgAQI = Math.round(forecast.reduce((sum, item) => sum + item.aqi, 0) / forecast.length);
  
  // Get AQI level
  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-100 text-green-800';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800';
    if (aqi <= 200) return 'bg-red-100 text-red-800';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800';
    return 'bg-red-900 text-white';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up':
        return 'Worsening';
      case 'down':
        return 'Improving';
      default:
        return 'Stable';
    }
  };

  return (
    <div className="space-y-4">
      {/* Hero Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">24-Hour Forecast Summary</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{avgAQI}</div>
                <div className="text-sm text-gray-600">Average AQI</div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="text-lg font-medium">{getTrendText()}</span>
              </div>
            </div>
            <Badge className={`${getAQIColor(avgAQI)} text-sm px-3 py-1`}>
              {getAQILevel(avgAQI)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Time Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Now */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-gray-700 mb-1">Now</div>
            <div className="text-2xl font-bold text-blue-600">{currentAQI}</div>
            <Badge className={`${getAQIColor(currentAQI)} text-xs mt-2`}>
              {getAQILevel(currentAQI)}
            </Badge>
          </CardContent>
        </Card>

        {/* 12 Hours */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-gray-700 mb-1">12 Hours</div>
            <div className="text-2xl font-bold text-blue-600">{forecast[12]?.aqi || currentAQI}</div>
            <Badge className={`${getAQIColor(forecast[12]?.aqi || currentAQI)} text-xs mt-2`}>
              {getAQILevel(forecast[12]?.aqi || currentAQI)}
            </Badge>
          </CardContent>
        </Card>

        {/* 24 Hours */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-gray-700 mb-1">24 Hours</div>
            <div className="text-2xl font-bold text-blue-600">{futureAQI}</div>
            <Badge className={`${getAQIColor(futureAQI)} text-xs mt-2`}>
              {getAQILevel(futureAQI)}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AirQualityChart;
