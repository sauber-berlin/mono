"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface TrashReport {
  id: string;
  lat: number;
  lng: number;
  description: string;
  photo?: string;
  createdAt: Date;
}

export interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  reports?: TrashReport[];
  onMapClick?: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapComponent({ 
  center = [52.5200, 13.4050], // Berlin center
  zoom = 13,
  reports = [],
  onMapClick,
}: MapComponentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Map click handler */}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      
      {/* Trash report markers */}
      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
          <Popup>
            <div className="max-w-xs">
              {report.photo && (
                <img 
                  src={report.photo} 
                  alt="Trash report"
                  className="w-full h-24 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm">{report.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {report.createdAt.toLocaleDateString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}