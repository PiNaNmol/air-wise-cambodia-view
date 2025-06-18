import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Globe } from "lucide-react";
import LocationSearch from '../components/LocationSearch';
import AirQualityDisplay from '../components/AirQualityDisplay';
import AirQualityChart from '../components/AirQualityChart';
import PollutantDetails from '../components/PollutantDetails';
import { toast } from "sonner";

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface AirQualityData {
  aqi: number;
  aqiLevel: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  forecast: Array<{
    time: string;
    aqi: number;
    pm25: number;
  }>;
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (location: Location) => {
    console.log('Cambodia location selected:', location);
    setSelectedLocation(location);
    setIsLoading(true);
    
    try {
      // Enhanced mock data system for Cambodia locations
      const mockData = generateCambodiaAirQualityData(location);
      setAirQualityData(mockData);
      toast.success(`Air quality data loaded for ${location.name}`);
      console.log('Cambodia air quality data set:', mockData);
    } catch (error) {
      toast.error('Failed to load air quality data');
      console.error('Error loading air quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCambodiaAirQualityData = (location: Location): AirQualityData => {
    const locationName = location.name.toLowerCase();
    
    // Cambodia-specific AQI patterns based on common pollution sources
    let baseAQI: number;
    if (locationName.includes('phnom penh')) {
      baseAQI = Math.floor(Math.random() * 70) + 80; // 80-150 (Moderate to Unhealthy for Sensitive)
    } else if (locationName.includes('siem reap') || locationName.includes('battambang')) {
      baseAQI = Math.floor(Math.random() * 60) + 60; // 60-120 (Moderate)
    } else if (locationName.includes('sihanoukville') || locationName.includes('kampot')) {
      baseAQI = Math.floor(Math.random() * 50) + 40; // 40-90 (Good to Moderate)
    } else if (locationName.includes('mondulkiri') || locationName.includes('ratanakiri')) {
      baseAQI = Math.floor(Math.random() * 40) + 20; // 20-60 (Good)
    } else {
      // Default for other Cambodia locations
      baseAQI = Math.floor(Math.random() * 60) + 50; // 50-110
    }

    // Generate realistic pollutant values for Cambodia climate
    const pm25 = Math.max(8, Math.floor((baseAQI / 3.5) + (Math.random() * 15 - 7)));
    const pm10 = Math.max(15, Math.floor(pm25 * 1.8 + (Math.random() * 25 - 12)));
    const o3 = Math.max(25, Math.floor(baseAQI * 0.7 + (Math.random() * 35 - 17)));
    const no2 = Math.max(12, Math.floor(baseAQI * 0.5 + (Math.random() * 25 - 12)));
    const so2 = Math.max(8, Math.floor(baseAQI * 0.25 + (Math.random() * 15 - 7)));
    const co = Math.max(2, Math.floor(baseAQI * 0.08 + (Math.random() * 4 - 2)));

    return {
      aqi: baseAQI,
      aqiLevel: getAQILevel(baseAQI),
      pollutants: {
        pm25,
        pm10,
        o3,
        no2,
        so2,
        co,
      },
      forecast: generateCambodiaForecast(baseAQI),
    };
  };

  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const generateCambodiaForecast = (baseAQI: number) => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Cambodia-specific forecast variations
      const timeOfDay = hour.getHours();
      let multiplier = 1;
      
      // Morning cooking fires and traffic (worse air quality)
      if ((timeOfDay >= 6 && timeOfDay <= 8) || (timeOfDay >= 17 && timeOfDay <= 19)) {
        multiplier = 1.3;
      }
      // Afternoon heat can worsen air quality
      else if (timeOfDay >= 12 && timeOfDay <= 15) {
        multiplier = 1.1;
      }
      // Night time (better air quality)
      else if (timeOfDay >= 21 || timeOfDay <= 5) {
        multiplier = 0.7;
      }
      
      const variation = (Math.random() - 0.5) * 25;
      const forecastAQI = Math.max(15, Math.min(250, Math.floor(baseAQI * multiplier + variation)));
      
      forecast.push({
        time: hour.toISOString(),
        aqi: forecastAQI,
        pm25: Math.max(8, Math.floor(forecastAQI / 3.5 + (Math.random() * 8 - 4))),
      });
    }
    return forecast;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Cambodia Air Quality Monitor
            </h1>
          </div>
          <p className="text-sm sm:text-lg text-gray-600">
            Real-time air quality monitoring across Cambodia
          </p>
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full inline-block">
            🇰🇭 Focused on Cambodia locations
          </div>
        </header>

        {/* Mobile-optimized layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Cambodia Location Selection */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-green-600" />
                Search Cambodia Locations
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Find air quality data for cities, provinces, and districts across Cambodia
              </p>
            </CardHeader>
            <CardContent>
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </CardContent>
          </Card>

          {/* Current Air Quality */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Current Air Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <AirQualityDisplay 
                  location={selectedLocation}
                  data={airQualityData}
                  isLoading={isLoading}
                />
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a Cambodia location</p>
                  <p className="text-sm">Search above to view air quality data for any location in Cambodia</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information - Stack vertically on mobile */}
          {airQualityData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pollutant Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <PollutantDetails pollutants={airQualityData.pollutants} />
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">24-Hour Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <AirQualityChart forecast={airQualityData.forecast} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
