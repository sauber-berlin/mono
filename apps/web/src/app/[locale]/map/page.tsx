"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import Map from '@/components/map/Map';

// Mock data - replace with real data later
const mockReports = [
  {
    id: '1',
    lat: 52.5200,
    lng: 13.4050,
    description: 'Plastic bottles near the fountain',
    photo: '/api/placeholder/200/150',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    lat: 52.5180,
    lng: 13.4070,
    description: 'Cigarette butts on the sidewalk',
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    lat: 52.5220,
    lng: 13.4030,
    description: 'Food containers in the park',
    photo: '/api/placeholder/200/150',
    createdAt: new Date('2024-01-13')
  }
];

export default function MapPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user location
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
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    // Navigate to report form with coordinates
    router.push(`/report?lat=${lat}&lng=${lng}`);
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
          <h1 className="text-xl font-bold">Trash Reports</h1>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        <div className="absolute inset-0">
          <Map
            center={userLocation || [52.5200, 13.4050]}
            zoom={13}
            reports={mockReports}
            onMapClick={handleMapClick}
          />
        </div>
        
        {/* Map overlay with stats */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{mockReports.length} reports in area</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Report
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg p-3 shadow-lg">
            <p className="text-sm text-gray-600 text-center">
              Tap on the map to report trash at that location
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}