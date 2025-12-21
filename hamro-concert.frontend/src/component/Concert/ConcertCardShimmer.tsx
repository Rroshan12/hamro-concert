export default function ConcertCardShimmer() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-orange-100 animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200" />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold bg-gray-300 text-transparent">
          000 tickets left
        </div>
      </div>

      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />

        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-gray-200 rounded mr-2" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-10" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
