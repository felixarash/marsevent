import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MarsEventCard = () => {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="hologram bg-slate-900/40 backdrop-blur-sm border border-cyan-800/30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/20">
        <div className="relative h-48">
          <Image
            src="/mars-surface.jpg"
            alt="Mars Event"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-cyan-400">Mars Colony Launch Party</h3>
            <p className="text-gray-300 text-sm">
              Join us for the most exclusive event in human history - the grand opening of humanity&apos;s first permanent Mars colony!
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-cyan-300 text-sm">
                <span className="mr-2">🗓️</span>
                <span>June 15, 2045</span>
              </div>
              <div className="flex items-center text-cyan-300 text-sm">
                <span className="mr-2">⏰</span>
                <span>20:00 MST (Mars Standard Time)</span>
              </div>
              <div className="flex items-center text-cyan-300 text-sm">
                <span className="mr-2">📍</span>
                <span>Olympus Mons Base, Mars</span>
              </div>
            </div>

            <Link href="/register" className="block">
              <button className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors duration-200 mt-4">
                Reserve Your Spot
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarsEventCard;
