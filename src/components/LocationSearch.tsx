
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { Location } from '../pages/Index';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    
    try {
      // Enhanced mock geocoding with actual city coordinates
      const cityCoordinates: { [key: string]: { lat: number; lng: number; name: string } } = {
        'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, NY, USA' },
        'london': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
        'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
        'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
        'sydney': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
        'berlin': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
        'moscow': { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia' },
        'beijing': { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' },
        'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
        'cairo': { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt' },
        'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA, USA' },
        'bangkok': { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand' },
        'phnom penh': { lat: 11.5564, lng: 104.9282, name: 'Phnom Penh, Cambodia' },
        'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
        'toronto': { lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada' },
        'mexico city': { lat: 19.4326, lng: -99.1332, name: 'Mexico City, Mexico' },
        'jakarta': { lat: -6.2088, lng: 106.8456, name: 'Jakarta, Indonesia' },
        'rome': { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy' },
        'madrid': { lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain' },
        'amsterdam': { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' }
      };

      const searchKey = searchQuery.toLowerCase().trim();
      let selectedCity = cityCoordinates[searchKey];

      // Try partial matching if exact match not found
      if (!selectedCity) {
        const matchingCity = Object.keys(cityCoordinates).find(city => 
          city.includes(searchKey) || searchKey.includes(city)
        );
        if (matchingCity) {
          selectedCity = cityCoordinates[matchingCity];
        }
      }

      // If still no match, default to a major city but inform user
      if (!selectedCity) {
        selectedCity = cityCoordinates['new york'];
        toast.warning(`Location "${searchQuery}" not found. Showing New York instead. Try cities like: London, Tokyo, Paris, etc.`);
      } else {
        toast.success(`Found location: ${selectedCity.name}`);
      }

      const location: Location = {
        lat: selectedCity.lat,
        lng: selectedCity.lng,
        name: selectedCity.name,
      };

      onLocationSelect(location);
    } catch (error) {
      toast.error('Failed to search for location');
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Search for a city (e.g., London, Tokyo, Phnom Penh)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button 
        onClick={handleSearch} 
        disabled={isSearching}
        size="icon"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LocationSearch;
