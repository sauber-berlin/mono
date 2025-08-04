"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Crosshair, Map } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export default function LocationPage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual' | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);

  const getCurrentLocation = () => {
    setIsLoadingGPS(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by this browser');
      setIsLoadingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationMethod('gps');
        setIsLoadingGPS(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setGpsError(errorMessage);
        setIsLoadingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleManualLocation = () => {
    router.push('/report/map-picker');
  };

  const handleContinue = () => {
    if (location) {
      // Store location in session storage or context
      sessionStorage.setItem('reportLocation', JSON.stringify(location));
      router.push('/report/form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
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
          <h1 className="text-xl font-bold">Select Location</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Where is the trash?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Methods */}
            <div className="space-y-3">
              {/* GPS Location */}
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingGPS}
                className="w-full h-16 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Crosshair className="h-6 w-6 mb-1" />
                <span>{isLoadingGPS ? 'Getting location...' : 'Use Current Location'}</span>
              </Button>

              <div className="text-center text-gray-500 text-sm">or</div>

              {/* Manual Location */}
              <Button
                onClick={handleManualLocation}
                variant="outline"
                className="w-full h-16 flex flex-col items-center justify-center border-green-600 text-green-600 hover:bg-green-50"
                size="lg"
              >
                <Map className="h-6 w-6 mb-1" />
                <span>Pick on Map</span>
              </Button>
            </div>

            {/* GPS Error */}
            {gpsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{gpsError}</p>
              </div>
            )}

            {/* Location Display */}
            {location && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    Location {locationMethod === 'gps' ? 'detected' : 'selected'}
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
                {locationMethod === 'gps' && (
                  <p className="text-xs text-green-600 mt-1">
                    Using your current GPS location
                  </p>
                )}
              </div>
            )}

            {/* Continue Button */}
            {location && (
              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Continue to Report Details
              </Button>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> For accurate reporting, use your current location if you're at the trash site, 
                or pick the exact spot on the map if you're reporting from elsewhere.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}