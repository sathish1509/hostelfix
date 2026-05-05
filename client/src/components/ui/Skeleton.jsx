import { cn } from "../../utils/cn";

export const Skeleton = ({ className }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
      className
    )}
  />
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export const SkeletonRow = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const SkeletonComplaintCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full" />
  </div>
);
