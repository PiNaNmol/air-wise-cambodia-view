
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Location } from '../pages/Index';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced city database with more global coverage
  const cityDatabase: LocationSuggestion[] = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
    { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
    { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
    { name: 'Moscow', lat: 55.7558, lng: 37.6176, country: 'Russia' },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA' },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand' },
    { name: 'Phnom Penh', lat: 11.5564, lng: 104.9282, country: 'Cambodia' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' },
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, country: 'Mexico' },
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
    { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy' },
    { name: 'Madrid', lat: 40.4168, lng: -3.7038, country: 'Spain' },
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
    { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
    { name: 'São Paulo', lat: -23.5558, lng: -46.6396, country: 'Brazil' },
    { name: 'Buenos Aires', lat: -34.6118, lng: -58.3960, country: 'Argentina' },
    { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey' },
    { name: 'Washington DC', lat: 38.9072, lng: -77.0369, country: 'USA' },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = cityDatabase.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = async (selectedCity?: LocationSuggestion) => {
    if (!searchQuery.trim() && !selectedCity) {
      toast.error('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      let targetCity = selectedCity;
      
      if (!targetCity) {
        // Try to find exact match first
        targetCity = cityDatabase.find(city => 
          city.name.toLowerCase() === searchQuery.toLowerCase().trim()
        );
        
        // If no exact match, try partial matching
        if (!targetCity) {
          targetCity = cityDatabase.find(city => 
            city.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            searchQuery.toLowerCase().trim().includes(city.name.toLowerCase())
          );
        }
      }

      if (!targetCity) {
        // Default to New York with a warning
        targetCity = cityDatabase.find(city => city.name === 'New York')!;
        toast.warning(`Location "${searchQuery}" not found. Showing New York instead. Try cities like: London, Tokyo, Paris, etc.`);
      } else {
        toast.success(`Found location: ${targetCity.name}, ${targetCity.country}`);
      }

      const location: Location = {
        lat: targetCity.lat,
        lng: targetCity.lng,
        name: `${targetCity.name}, ${targetCity.country}`,
      };

      onLocationSelect(location);
      setSearchQuery('');
    } catch (error) {
      toast.error('Failed to search for location');
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setSearchQuery(suggestion.name);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search cities (e.g., London, Tokyo, New York)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-4"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{suggestion.name}</div>
                    <div className="text-xs text-gray-500">{suggestion.country}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => handleSearch()} 
          disabled={isSearching}
          size="icon"
          className="flex-shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LocationSearch;
