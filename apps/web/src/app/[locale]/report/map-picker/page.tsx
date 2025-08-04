"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Check } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import Map from '@/components/map/Map';

export default function MapPickerPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user location for initial map center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Berlin center
          setUserLocation([52.5200, 13.4050]);
        }
      );
    } else {
      setUserLocation([52.5200, 13.4050]);
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    console.log('handleMapClick called:', lat, lng); // Debug log
    const newLocation = { lat, lng };
    console.log('Setting location to:', newLocation); // Debug log
    setSelectedLocation(newLocation);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      sessionStorage.setItem('reportLocation', JSON.stringify(selectedLocation));
      router.push('/report/form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-green-700 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Pick Location</h1>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        <div className="absolute inset-0">
          <Map
            center={userLocation || [52.5200, 13.4050]}
            zoom={15}
            reports={[]}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Instructions */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <p className="text-sm text-gray-800 text-center">
              <strong>Tap on the map</strong> to select the trash location
            </p>
          </div>
        </div>

        {/* Selected Location Indicator */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Location Selected!</p>
                    <p className="text-xs text-green-700">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleConfirmLocation}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="absolute top-20 left-4 z-10 bg-red-100 p-2 rounded text-xs">
          Selected: {selectedLocation ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}` : 'None'}
        </div>

        {/* Crosshair for precise selection */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-8 h-8 border-2 border-green-600 rounded-full bg-green-600/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}