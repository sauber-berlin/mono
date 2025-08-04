"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

export default function ReportPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(photoDataUrl);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
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
          <h1 className="text-xl font-bold">Report Trash</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Take a Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera/Photo Display */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
              {isCapturing ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white text-gray-800 hover:bg-gray-100"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                  </div>
                </>
              ) : photo ? (
                <>
                  <img
                    src={photo}
                    alt="Captured trash"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="bg-white"
                    >
                      Retake
                    </Button>
                    <Button
                      onClick={() => router.push('/report/location')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Camera className="h-16 w-16 mb-4" />
                  <p className="text-center mb-4">No photo taken yet</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isCapturing && !photo && (
              <div className="space-y-3">
                <Button
                  onClick={startCamera}
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Open Camera
                </Button>
                
                <div className="text-center text-gray-500">or</div>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photo
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}