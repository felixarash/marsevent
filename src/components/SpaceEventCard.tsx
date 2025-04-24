import React from 'react';
import Image from 'next/image';

interface SpaceEvent {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export default function SpaceEventCard({ title, date, description, imageUrl }: SpaceEvent) {
  return (
    <div className="bg-space-card rounded-lg p-4 w-full md:w-96 h-[400px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-full h-48 mb-4">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-sm mb-2">{date}</p>
      <p className="text-gray-300 line-clamp-3">{description}</p>
      <div className="flex justify-between items-center mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Learn More
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white">→</span>
        </div>
      </div>
    </div>
  );
}
