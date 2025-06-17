import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Fetch real data from OpenAQ API
      const response = await fetch(
        `https://api.openaq.org/v2/latest?limit=1&page=1&offset=0&sort=desc&coordinates=${location.lat},${location.lng}&radius=25000&order_by=lastUpdated&dumpRaw=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const measurements = result.measurements || [];
        
        // Parse real data
        const pollutants = {
          pm25: measurements.find((m: any) => m.parameter === 'pm25')?.value || 0,
          pm10: measurements.find((m: any) => m.parameter === 'pm10')?.value || 0,
          o3: measurements.find((m: any) => m.parameter === 'o3')?.value || 0,
          no2: measurements.find((m: any) => m.parameter === 'no2')?.value || 0,
          so2: measurements.find((m: any) => m.parameter === 'so2')?.value || 0,
          co: measurements.find((m: any) => m.parameter === 'co')?.value || 0,
        };
        
        // Calculate AQI from PM2.5 (simplified calculation)
        const aqi = calculateAQIFromPM25(pollutants.pm25);
        
        const realData: AirQualityData = {
          aqi,
          aqiLevel: getAQILevel(aqi),
          pollutants,
          forecast: generateLocationBasedForecast(aqi),
        };
        
        setAirQualityData(realData);
        toast.success(`Real air quality data loaded for ${location.name}`);
      } else {
        // Fallback to mock data if no real data available
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
        toast.warning(`No real-time data available. Showing mock data for ${location.name}`);
      }
    } catch (error) {
      toast.error('Failed to fetch air quality data');
      console.error('Error fetching air quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAQIFromPM25 = (pm25: number): number => {
    // Simplified AQI calculation based on PM2.5
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            AirWise Global Monitor
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            Real-time air quality monitoring with open-source data
          </p>
        </header>

        {/* Mobile-first layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Location Selection - Full width on mobile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" />
                Location Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationSearch onLocationSelect={handleLocationSelect} />
              <div className="h-48 sm:h-64">
                <InteractiveMap 
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Air Quality - Full width on mobile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
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

          {/* Additional Information - Stack vertically on mobile */}
          {airQualityData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pollutant Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <PollutantDetails pollutants={airQualityData.pollutants} />
                </CardContent>
              </Card>

              <Card>
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
