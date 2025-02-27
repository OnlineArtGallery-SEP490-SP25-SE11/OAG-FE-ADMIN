'use client';
import Image from 'next/image';
import { vietnamCurrency } from '@/utils';

interface Artwork {
  id: string;
  title: string;
  image: string;
  artist: string;
  views: number;
  revenue: number;
}

const topArtworks: Artwork[] = [
  {
    id: '1',
    title: "Abstract Dreams",
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
    artist: "Sarah Johnson",
    views: 12500,
    revenue: 1150000,
  },
  {
    id: '2',
    title: "Ocean Waves",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    artist: "Michael Chen", 
    views: 10200,
    revenue: 700000,
  },
  {
    id: '3',
    title: "Mountain Sunset",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    artist: "Emily Davis",
    views: 9800,
    revenue: 1600000,
  },
  {
    id: '4',
    title: "Urban Life",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    artist: "Alex Thompson",
    views: 8900,
    revenue: 1050000,
  },
];

export function TopArtworks() {
  return (
    <div className="space-y-8">
      {topArtworks.map((artwork) => (
        <div key={artwork.id} className="flex items-center space-x-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{artwork.title}</p>
              <p className="text-sm text-muted-foreground">
                {vietnamCurrency(artwork.revenue)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{artwork.artist}</p>
            <p className="text-xs text-muted-foreground">
              {artwork.views.toLocaleString()} views
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
