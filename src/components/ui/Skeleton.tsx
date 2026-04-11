export function SkeletonText({ width = 'w-full', height = 'h-3' }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} bg-cream-2 rounded-full animate-pulse`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-card p-4 flex gap-3">
      <div className="w-13 h-13 bg-cream-2 rounded-[14px] animate-pulse flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <SkeletonText width="w-3/4" height="h-3.5" />
        <SkeletonText width="w-1/2" height="h-2.5" />
        <SkeletonText width="w-1/3" height="h-2" />
      </div>
      <div className="w-2.5 h-2.5 bg-cream-2 rounded-full animate-pulse flex-shrink-0 self-center" />
    </div>
  )
}

export function SkeletonTile() {
  return (
    <div className="bg-white rounded-[28px] shadow-card p-4 flex flex-col items-center gap-2">
      <div className="w-11 h-11 bg-cream-2 rounded-full animate-pulse" />
      <SkeletonText width="w-3/4" height="h-3" />
      <SkeletonText width="w-1/2" height="h-2.5" />
    </div>
  )
}

export function SkeletonImage({ className = '' }: { className?: string }) {
  return <div className={`bg-cream-2 animate-pulse rounded-[20px] ${className}`} />
}

export function SkeletonResultCard() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-[20px] shadow-card-lg p-5 space-y-3">
        <SkeletonText width="w-1/2" height="h-6" />
        <SkeletonText width="w-1/3" height="h-3" />
        <div className="flex gap-2 mt-2">
          <div className="w-20 h-6 bg-cream-2 rounded-full animate-pulse" />
          <div className="w-16 h-6 bg-cream-2 rounded-full animate-pulse" />
        </div>
        <div className="h-2 bg-cream-2 rounded-full animate-pulse mt-3" />
      </div>
    </div>
  )
}
