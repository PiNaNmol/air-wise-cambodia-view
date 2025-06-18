
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Location } from '../pages/Index';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

interface CambodiaLocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  province: string;
  type: string; // city, district, commune
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<CambodiaLocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Comprehensive Cambodia locations database
  const cambodiaLocations: CambodiaLocationSuggestion[] = [
    // Major Cities
    { name: 'Phnom Penh', lat: 11.5564, lng: 104.9282, province: 'Phnom Penh', type: 'city' },
    { name: 'Siem Reap', lat: 13.3671, lng: 103.8448, province: 'Siem Reap', type: 'city' },
    { name: 'Battambang', lat: 13.0957, lng: 103.2022, province: 'Battambang', type: 'city' },
    { name: 'Sihanoukville', lat: 10.6090, lng: 103.5294, province: 'Preah Sihanouk', type: 'city' },
    { name: 'Kampong Cham', lat: 11.9934, lng: 105.4635, province: 'Kampong Cham', type: 'city' },
    { name: 'Kampot', lat: 10.6104, lng: 104.1819, province: 'Kampot', type: 'city' },
    { name: 'Kep', lat: 10.4833, lng: 104.3167, province: 'Kep', type: 'city' },
    { name: 'Pursat', lat: 12.5388, lng: 103.9192, province: 'Pursat', type: 'city' },
    { name: 'Takeo', lat: 10.9909, lng: 104.7851, province: 'Takeo', type: 'city' },
    { name: 'Kampong Speu', lat: 11.4565, lng: 104.5225, province: 'Kampong Speu', type: 'city' },
    
    // Provincial Towns
    { name: 'Kratie', lat: 12.4888, lng: 106.0197, province: 'Kratie', type: 'city' },
    { name: 'Stung Treng', lat: 13.5259, lng: 105.9683, province: 'Stung Treng', type: 'city' },
    { name: 'Preah Vihear', lat: 13.8073, lng: 104.9739, province: 'Preah Vihear', type: 'city' },
    { name: 'Mondulkiri', lat: 12.4545, lng: 107.2032, province: 'Mondulkiri', type: 'city' },
    { name: 'Ratanakiri', lat: 13.7351, lng: 106.9880, province: 'Ratanakiri', type: 'city' },
    { name: 'Pailin', lat: 12.8481, lng: 102.6077, province: 'Pailin', type: 'city' },
    { name: 'Banteay Meanchey', lat: 13.7436, lng: 102.9746, province: 'Banteay Meanchey', type: 'city' },
    { name: 'Oddar Meanchey', lat: 14.1167, lng: 103.5167, province: 'Oddar Meanchey', type: 'city' },
    { name: 'Koh Kong', lat: 11.6153, lng: 102.9840, province: 'Koh Kong', type: 'city' },
    { name: 'Prey Veng', lat: 11.4869, lng: 105.3250, province: 'Prey Veng', type: 'city' },
    { name: 'Svay Rieng', lat: 11.0879, lng: 105.7993, province: 'Svay Rieng', type: 'city' },
    { name: 'Kampong Chhnang', lat: 12.2497, lng: 104.6644, province: 'Kampong Chhnang', type: 'city' },
    { name: 'Kampong Thom', lat: 12.7112, lng: 104.8889, province: 'Kampong Thom', type: 'city' },
    { name: 'Tboung Khmum', lat: 12.2006, lng: 105.4272, province: 'Tboung Khmum', type: 'city' },
    
    // Important Districts/Towns
    { name: 'Poipet', lat: 13.6500, lng: 102.5667, province: 'Banteay Meanchey', type: 'district' },
    { name: 'Bavet', lat: 11.1167, lng: 105.9000, province: 'Svay Rieng', type: 'district' },
    { name: 'Sisophon', lat: 13.5859, lng: 102.9740, province: 'Banteay Meanchey', type: 'district' },
    { name: 'Kompong Som', lat: 10.6270, lng: 103.5098, province: 'Preah Sihanouk', type: 'district' },
    { name: 'Angkor', lat: 13.4125, lng: 103.8670, province: 'Siem Reap', type: 'district' },
    { name: 'Ta Khmau', lat: 11.4833, lng: 104.9500, province: 'Kandal', type: 'district' },
    { name: 'Chbar Mon', lat: 11.2500, lng: 105.1167, province: 'Kampong Speu', type: 'district' },
    { name: 'Suong', lat: 11.9500, lng: 105.7500, province: 'Tboung Khmum', type: 'district' },
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = cambodiaLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = async (selectedLocation?: CambodiaLocationSuggestion) => {
    if (!searchQuery.trim() && !selectedLocation) {
      toast.error('Please enter a Cambodia location to search');
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      let targetLocation = selectedLocation;
      
      if (!targetLocation) {
        // Try exact match first
        targetLocation = cambodiaLocations.find(location => 
          location.name.toLowerCase() === searchQuery.toLowerCase().trim()
        );
        
        // Try partial matching
        if (!targetLocation) {
          targetLocation = cambodiaLocations.find(location => 
            location.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
          );
        }
      }

      if (!targetLocation) {
        // Fallback to Phnom Penh
        targetLocation = cambodiaLocations.find(location => location.name === 'Phnom Penh')!;
        toast.warning(`Location "${searchQuery}" not found in Cambodia. Showing available locations: ${cambodiaLocations.slice(0, 5).map(c => c.name).join(', ')}, etc.`);
      } else {
        toast.success(`Located: ${targetLocation.name}, ${targetLocation.province}`);
      }

      console.log('Searching for Cambodia location:', targetLocation);

      const location: Location = {
        lat: targetLocation.lat,
        lng: targetLocation.lng,
        name: `${targetLocation.name}, ${targetLocation.province}`,
      };

      onLocationSelect(location);
      setSearchQuery('');
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: CambodiaLocationSuggestion) => {
    console.log('Cambodia suggestion clicked:', suggestion);
    setSearchQuery('');
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search Cambodia locations (e.g., Phnom Penh, Siem Reap, Battambang)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className="pr-4"
          />
          
          {/* Enhanced suggestions dropdown for Cambodia */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.name}-${suggestion.province}-${index}`}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-gray-900">{suggestion.name}</div>
                    <div className="text-xs text-gray-600">{suggestion.province} Province</div>
                    <div className="text-xs text-blue-600 capitalize">{suggestion.type}</div>
                  </div>
                  <div className="text-xs text-gray-400 hidden sm:block">
                    {suggestion.lat.toFixed(3)}, {suggestion.lng.toFixed(3)}
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
      
      {/* Popular Cambodia locations quick access */}
      <div className="mt-3">
        <div className="text-xs text-gray-600 mb-2">Popular locations:</div>
        <div className="flex flex-wrap gap-2">
          {cambodiaLocations.slice(0, 6).map((location) => (
            <button
              key={location.name}
              onClick={() => handleSuggestionClick(location)}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
