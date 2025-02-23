import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getBlogs } from "@/service/blog-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/error-boundary";

async function BlogsTableContent() {
  const blogs = await getBlogs();
  return <DataTable columns={columns} data={blogs} />;
}

export function BlogsTable() {
  return (
    <ErrorBoundary 
      fallback={
        <div className="text-center p-4 text-red-500">
          Failed to load blog data
        </div>
      }
    >
      <Suspense 
        fallback={<TableSkeleton />}
      >
        <BlogsTableContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {/* Search and Export Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <Skeleton className="h-4 w-4" /> {/* Search icon */}
          <Skeleton className="h-8 w-64" /> {/* Search input */}
        </div>
        <Skeleton className="h-8 w-24" /> {/* Export button */}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border bg-white dark:bg-gray-800 shadow">
        {/* Header */}
        <div className="border-b">
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <div key={`header-${i}`} className="flex-1 p-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        {[...Array(4)].map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {[...Array(4)].map((_, cellIndex) => (
              <div key={`cell-${rowIndex}-${cellIndex}`} className="flex-1 p-5">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-48" /> {/* Results text */}
          <Skeleton className="h-7 w-[60px]" /> {/* Page size select */}
        </div>
        <div className="space-x-1 flex">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`pagination-${i}`} className="h-7 w-7" /> /* Pagination buttons */
          ))}
        </div>
      </div>
    </div>
  );
}