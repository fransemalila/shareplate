import React, { useEffect, useRef, useState } from 'react';
import { FoodListing, Location } from '../../types';
import mapboxgl from 'mapbox-gl';

// Initialize mapbox token
if (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
}

interface FoodListingMapProps {
  listings: FoodListing[];
  center: Location;
  zoom: number;
  onMarkerClick?: (listing: FoodListing) => void;
}

const FoodListingMap: React.FC<FoodListingMapProps> = ({
  listings,
  center,
  zoom,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      if (!mapboxgl.accessToken) {
        setMapError('Mapbox access token is missing. Please check your environment variables.');
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [center.lng, center.lat],
        zoom: zoom
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      setMapError('Failed to initialize map. Please check your Mapbox configuration.');
      console.error('Map initialization error:', error);
    }
  }, [center.lat, center.lng, zoom]);

  // Update markers when listings change
  useEffect(() => {
    if (!map.current || !mapboxgl) return;

    try {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add new markers
      listings.forEach(listing => {
        if (listing.location) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-medium text-gray-900">${listing.title}</h3>
              <p class="text-sm text-gray-600">$${listing.price.toFixed(2)}</p>
            </div>
          `);

          const marker = new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat([listing.location.lng, listing.location.lat])
            .setPopup(popup)
            .addTo(map.current);

          marker.getElement().addEventListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(listing);
            }
          });

          markers.current.push(marker);
        }
      });

      // Fit bounds to show all markers if there are any
      if (markers.current.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        markers.current.forEach(marker => {
          bounds.extend(marker.getLngLat());
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      setMapError('Failed to update map markers.');
      console.error('Marker update error:', error);
    }
  }, [listings]);

  // Update center when it changes
  useEffect(() => {
    if (map.current && !mapError) {
      map.current.setCenter([center.lng, center.lat]);
    }
  }, [center]);

  // Update zoom when it changes
  useEffect(() => {
    if (map.current && !mapError) {
      map.current.setZoom(zoom);
    }
  }, [zoom]);

  const handleSearch = async () => {
    if (!searchQuery || !map.current || !mapboxgl) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 13
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  if (mapError) {
    return (
      <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-red-500 mb-2">⚠️ Map Error</div>
            <div className="text-gray-600">{mapError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Search bar */}
      <div className="absolute top-4 left-4 right-4 max-w-md mx-auto z-10">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search location..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodListingMap; 