'use client';
import { useState, useEffect } from 'react';
import SpaceEventCard from '@/components/SpaceEventCard';
import SkeletonCard from '@/components/SkeletonCard';

const mockEvents = [
  {
    title: "Mars Landing Mission",
    date: "2024-06-15",
    description: "Join us for the historic landing of the new Mars rover, exploring the red planet's surface for signs of ancient life.",
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679"
  },
  {
    title: "Solar Eclipse Viewing",
    date: "2024-07-02",
    description: "Experience the breathtaking total solar eclipse from our observatory. Special telescopes and guides available.",
    imageUrl: "https://images.unsplash.com/photo-1532798369041-b33eb576ef16"
  },
  // Add more events as needed
];

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<typeof mockEvents>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-space-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Space Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event, index) => (
                <SpaceEventCard key={index} {...event} />
              ))
          }
        </div>
      </div>
    </div>
  );
}
