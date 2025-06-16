
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from "sonner";
import type { Location } from '../pages/Index';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  onLocationSelect, 
  selectedLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([40.7128, -74.0060], 10);

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add click event listener
    map.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      try {
        // For demonstration, we'll use a mock reverse geocoding
        // In a real application, you would use Google Geocoding API or similar
        const location: Location = {
          lat,
          lng,
          name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        };

        onLocationSelect(location);
        toast.success('Location selected from map');
      } catch (error) {
        toast.error('Failed to get location details');
        console.error('Reverse geocoding error:', error);
      }
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onLocationSelect]);

  // Update marker when selected location changes
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    // Remove existing marker
    if (marker.current) {
      map.current.removeLayer(marker.current);
    }

    // Add new marker
    marker.current = L.marker([selectedLocation.lat, selectedLocation.lng])
      .addTo(map.current)
      .bindPopup(selectedLocation.name);

    // Center map on selected location
    map.current.setView([selectedLocation.lat, selectedLocation.lng], 12);
  }, [selectedLocation]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg border cursor-pointer"
      style={{ minHeight: '250px' }}
    />
  );
};

export default InteractiveMap;
