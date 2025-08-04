"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import type { MapComponentProps } from './MapComponent';

export interface TrashReport {
  id: string;
  lat: number;
  lng: number;
  description: string;
  photo?: string;
  createdAt: Date;
}

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  reports?: TrashReport[];
  onMapClick?: (lat: number, lng: number) => void;
}

// Dynamic import of the entire map component
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <MapPin className="h-5 w-5" />
        <span>Loading map...</span>
      </div>
    </div>
  )
}) as React.ComponentType<MapComponentProps>;

export default function Map(props: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="h-5 w-5" />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return <DynamicMap {...props} />;
}