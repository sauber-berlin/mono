"use client";

import { Button } from '@/components/ui/button';
import { Home, MapPin, BarChart3, User } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/map', icon: MapPin, label: 'Map' },
  { href: '/stats', icon: BarChart3, label: 'Stats' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                className={`flex-1 flex flex-col items-center py-2 px-2 ${
                  isActive ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-green-600' : 'text-gray-600'}`} />
                <span className={`text-xs ${isActive ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}