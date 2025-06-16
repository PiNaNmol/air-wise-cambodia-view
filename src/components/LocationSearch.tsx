
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
      // For demonstration, we'll use a mock geocoding service
      // In a real application, you would use Google Geocoding API or similar
      const mockLocations = [
        { lat: 40.7128, lng: -74.0060, name: 'New York, NY, USA' },
        { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
        { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
        { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
        { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
      ];

      // Simple mock search - in reality, this would be a proper geocoding API call
      const mockResult = mockLocations.find(loc => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || mockLocations[0];

      // Add some randomness to simulate different search results
      const location: Location = {
        lat: mockResult.lat + (Math.random() - 0.5) * 0.1,
        lng: mockResult.lng + (Math.random() - 0.5) * 0.1,
        name: searchQuery,
      };

      onLocationSelect(location);
      toast.success(`Found location: ${location.name}`);
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
        placeholder="Search for a city, address, or coordinates..."
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
