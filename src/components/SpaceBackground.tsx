export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0">
        <div className="space-background"></div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="space-gradient"></div>
      </div>
    </div>
  );
}
