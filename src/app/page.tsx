import MarsEventCard from './components/MarsEventCard';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="space-background absolute inset-0"></div>
      <div className="stars absolute inset-0"></div>
      <div className="scanline pointer-events-none"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 text-center mb-4">
          Felix Space Events
        </h1>
        <p className="text-cyan-400 text-center text-lg mb-8">Since 5000 BC</p>
        <div className="tech-line mb-8"></div>
        <div className="flex justify-center">
          <MarsEventCard />
        </div>
      </div>
    </main>
  );
}
