
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
    console.log('Location selected:', location);
    setSelectedLocation(location);
    setIsLoading(true);
    
    try {
      // Use enhanced mock data system since OpenAQ API has CORS restrictions
      const mockData = generateRealisticAirQualityData(location);
      setAirQualityData(mockData);
      toast.success(`Air quality data loaded for ${location.name}`);
      console.log('Air quality data set:', mockData);
    } catch (error) {
      toast.error('Failed to load air quality data');
      console.error('Error loading air quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRealisticAirQualityData = (location: Location): AirQualityData => {
    const locationName = location.name.toLowerCase();
    
    // Base AQI on location characteristics
    let baseAQI: number;
    if (locationName.includes('beijing') || locationName.includes('delhi') || locationName.includes('mumbai')) {
      baseAQI = Math.floor(Math.random() * 80) + 120; // 120-200 (Unhealthy range)
    } else if (locationName.includes('london') || locationName.includes('new york') || locationName.includes('paris')) {
      baseAQI = Math.floor(Math.random() * 50) + 50; // 50-100 (Moderate range)
    } else if (locationName.includes('sydney') || locationName.includes('singapore') || locationName.includes('toronto')) {
      baseAQI = Math.floor(Math.random() * 40) + 20; // 20-60 (Good range)
    } else {
      // Default for other locations
      baseAQI = Math.floor(Math.random() * 80) + 40; // 40-120
    }

    // Generate realistic pollutant values based on AQI
    const pm25 = Math.max(5, Math.floor((baseAQI / 4) + (Math.random() * 20 - 10)));
    const pm10 = Math.max(10, Math.floor(pm25 * 1.5 + (Math.random() * 30 - 15)));
    const o3 = Math.max(20, Math.floor(baseAQI * 0.8 + (Math.random() * 40 - 20)));
    const no2 = Math.max(10, Math.floor(baseAQI * 0.6 + (Math.random() * 30 - 15)));
    const so2 = Math.max(5, Math.floor(baseAQI * 0.3 + (Math.random() * 20 - 10)));
    const co = Math.max(1, Math.floor(baseAQI * 0.1 + (Math.random() * 5 - 2.5)));

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
      forecast: generateLocationBasedForecast(baseAQI),
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

  const generateLocationBasedForecast = (baseAQI: number) => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Create realistic forecast variations
      const timeOfDay = hour.getHours();
      let multiplier = 1;
      
      // Rush hour adjustments (worse air quality)
      if ((timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19)) {
        multiplier = 1.2;
      }
      // Night time (better air quality)
      else if (timeOfDay >= 22 || timeOfDay <= 6) {
        multiplier = 0.8;
      }
      
      const variation = (Math.random() - 0.5) * 30;
      const forecastAQI = Math.max(10, Math.min(300, Math.floor(baseAQI * multiplier + variation)));
      
      forecast.push({
        time: hour.toISOString(),
        aqi: forecastAQI,
        pm25: Math.max(5, Math.floor(forecastAQI / 4 + (Math.random() * 10 - 5))),
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
            Real-time air quality monitoring with enhanced mock data
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
