
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Location, AirQualityData } from '../pages/Index';

interface AirQualityDisplayProps {
  location: Location;
  data: AirQualityData | null;
  isLoading: boolean;
}

const AirQualityDisplay: React.FC<AirQualityDisplayProps> = ({ 
  location, 
  data, 
  isLoading 
}) => {
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-red-800';
  };

  const getAQITextColor = (aqi: number): string => {
    if (aqi <= 50) return 'text-green-700';
    if (aqi <= 100) return 'text-yellow-700';
    if (aqi <= 150) return 'text-orange-700';
    if (aqi <= 200) return 'text-red-700';
    if (aqi <= 300) return 'text-purple-700';
    return 'text-red-900';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-8">
        No air quality data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {location.name}
        </h3>
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${getAQIColor(data.aqi)} text-white`}>
          <span className="text-2xl font-bold mr-2">AQI {data.aqi}</span>
        </div>
        <p className={`mt-2 font-medium ${getAQITextColor(data.aqi)}`}>
          {data.aqiLevel}
        </p>
      </div>

      <Card>
        <CardContent className="pt-4">
          <h4 className="font-semibold mb-3">Current Pollutant Levels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">PM2.5</div>
              <div className="font-semibold">{data.pollutants.pm25} μg/m³</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">PM10</div>
              <div className="font-semibold">{data.pollutants.pm10} μg/m³</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">O3</div>
              <div className="font-semibold">{data.pollutants.o3} ppb</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">NO2</div>
              <div className="font-semibold">{data.pollutants.no2} ppb</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">SO2</div>
              <div className="font-semibold">{data.pollutants.so2} ppb</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">CO</div>
              <div className="font-semibold">{data.pollutants.co} ppm</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirQualityDisplay;
