export default function SkeletonCard() {
  return (
    <div className="bg-space-card rounded-lg p-4 w-full md:w-96 h-[400px] animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 w-24 bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}
