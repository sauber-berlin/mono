import { Button } from '@/components/ui/button';
import { Camera, MapPin, Home, BarChart3, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">Sauber Berlin</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Keep Berlin Clean
          </h2>
          <p className="text-gray-600">
            Report trash and help make our city cleaner
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/report">
            <Button 
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Report Trash
            </Button>
          </Link>
          
          <Link href="/map">
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg border-green-600 text-green-600 hover:bg-green-50"
              size="lg"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">42</div>
              <div className="text-sm text-gray-600">Reports Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">128</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2">
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Stats</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col items-center py-2">
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}