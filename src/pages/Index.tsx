
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import LocationSearch from '../components/LocationSearch';
import InteractiveMap from '../components/InteractiveMap';
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
    setSelectedLocation(location);
    setIsLoading(true);
    
    try {
      // Enhanced mock data with more realistic values based on location
      const locationBasedAQI = getLocationBasedAQI(location.name);
      
      const mockData: AirQualityData = {
        aqi: locationBasedAQI,
        aqiLevel: getAQILevel(locationBasedAQI),
        pollutants: {
          pm25: Math.floor(Math.random() * 50) + 5,
          pm10: Math.floor(Math.random() * 100) + 10,
          o3: Math.floor(Math.random() * 150) + 20,
          no2: Math.floor(Math.random() * 100) + 10,
          so2: Math.floor(Math.random() * 50) + 5,
          co: Math.floor(Math.random() * 10) + 1,
        },
        forecast: generateLocationBasedForecast(locationBasedAQI),
      };
      
      setAirQualityData(mockData);
      toast.success(`Air quality data loaded for ${location.name}`);
    } catch (error) {
      toast.error('Failed to fetch air quality data');
      console.error('Error fetching air quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationBasedAQI = (locationName: string): number => {
    // Simulate different AQI levels for different cities
    const lowerCaseName = locationName.toLowerCase();
    if (lowerCaseName.includes('beijing') || lowerCaseName.includes('delhi')) {
      return Math.floor(Math.random() * 100) + 150; // Unhealthy range
    } else if (lowerCaseName.includes('london') || lowerCaseName.includes('new york')) {
      return Math.floor(Math.random() * 50) + 50; // Moderate range
    } else if (lowerCaseName.includes('sydney') || lowerCaseName.includes('singapore')) {
      return Math.floor(Math.random() * 50) + 10; // Good range
    }
    return Math.floor(Math.random() * 150) + 20; // Random for others
  };

  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const generateLocationBasedForecast = (baseAQI: number) => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Create more realistic forecast variations around the base AQI
      const variation = (Math.random() - 0.5) * 40; // ±20 variation
      const forecastAQI = Math.max(10, Math.min(300, baseAQI + variation));
      
      forecast.push({
        time: hour.toISOString(),
        aqi: Math.floor(forecastAQI),
        pm25: Math.floor(Math.random() * 40) + 5,
      });
    }
    return forecast;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AirWise Global Monitor
          </h1>
          <p className="text-lg text-gray-600">
            Real-time air quality monitoring with AI-powered insights
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Location Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationSearch onLocationSelect={handleLocationSelect} />
              <div className="h-64">
                <InteractiveMap 
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Air Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
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
                <div className="text-center text-gray-500 py-8">
                  Select a location to view air quality data
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {airQualityData && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Pollutant Details</CardTitle>
              </CardHeader>
              <CardContent>
                <PollutantDetails pollutants={airQualityData.pollutants} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>24-Hour Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <AirQualityChart forecast={airQualityData.forecast} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
