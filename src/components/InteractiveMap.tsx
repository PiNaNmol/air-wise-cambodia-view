
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

  // Major cities for quick access
  const majorCities = [
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Beijing, China', lat: 39.9042, lng: 116.4074 },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    { name: 'São Paulo, Brazil', lat: -23.5558, lng: -46.6396 },
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with better mobile defaults
    map.current = L.map(mapContainer.current, {
      zoomControl: false, // We'll add it manually for better positioning
      attributionControl: true,
    }).setView([20, 0], 2); // World view

    // Add zoom controls in top-right for mobile
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add major city markers for quick access
    majorCities.forEach(city => {
      const cityMarker = L.circleMarker([city.lat, city.lng], {
        radius: 4,
        fillColor: '#3b82f6',
        color: '#1d4ed8',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      })
      .addTo(map.current!)
      .bindTooltip(city.name, { 
        permanent: false, 
        direction: 'top',
        className: 'text-xs'
      })
      .on('click', () => {
        const location: Location = {
          lat: city.lat,
          lng: city.lng,
          name: city.name,
        };
        onLocationSelect(location);
        toast.success(`Selected ${city.name}`);
      });
    });

    // Add click event listener for custom locations
    map.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      try {
        // Simple reverse geocoding using Nominatim (free OpenStreetMap service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
        );
        
        let locationName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        if (response.ok) {
          const data = await response.json();
          if (data.display_name) {
            // Extract city and country from the display name
            const parts = data.display_name.split(',');
            const city = data.address?.city || data.address?.town || data.address?.village || parts[0];
            const country = data.address?.country || parts[parts.length - 1];
            locationName = `${city}, ${country}`.trim();
          }
        }

        const location: Location = {
          lat,
          lng,
          name: locationName,
        };

        onLocationSelect(location);
        toast.success('Location selected from map');
      } catch (error) {
        const location: Location = {
          lat,
          lng,
          name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        };
        onLocationSelect(location);
        toast.success('Location selected from map');
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

    // Add new marker with custom styling
    marker.current = L.marker([selectedLocation.lat, selectedLocation.lng], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    })
    .addTo(map.current)
    .bindPopup(`<div class="text-sm font-medium">${selectedLocation.name}</div>`, {
      closeButton: false
    })
    .openPopup();

    // Center map on selected location with appropriate zoom
    map.current.setView([selectedLocation.lat, selectedLocation.lng], 10, {
      animate: true,
      duration: 1
    });
  }, [selectedLocation]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg border cursor-pointer"
      style={{ minHeight: '200px', touchAction: 'manipulation' }}
    />
  );
};

export default InteractiveMap;
