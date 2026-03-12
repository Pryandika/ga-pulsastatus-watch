export default function Loading() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
