export function SkeletonPin() {
    // Random height for "Masonry" feel in skeleton
    const heightClass = ['h-64', 'h-80', 'h-96', 'h-48'][Math.floor(Math.random() * 4)]

    return (
        <div className="mb-4 break-inside-avoid">
            <div className={`w-full ${heightClass} bg-gray-200 rounded-2xl animate-pulse`} />
            <div className="mt-2 pl-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
