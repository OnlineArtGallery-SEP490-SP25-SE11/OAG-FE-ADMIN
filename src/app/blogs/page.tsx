import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";
import BlogsContent from "./blog-content";
import { TableSkeleton } from "./blogs-table";



export default function BlogsPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
      <Suspense fallback={<TableSkeleton />}>
        <BlogsContent />
      </Suspense>
    </ErrorBoundary>
  );
}