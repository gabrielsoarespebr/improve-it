export function Skeleton() {
  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/5" />
    </div>
  );
}
