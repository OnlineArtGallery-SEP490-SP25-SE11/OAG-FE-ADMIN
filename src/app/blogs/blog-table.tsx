import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getBlogs } from "@/service/blog-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


async function BlogsTableContent() {
  const blogs = await getBlogs();



  return <DataTable columns={columns} data={blogs} />;

}

export async function BlogsTable() {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<TableSkeleton />}>

        <BlogsTableContent />
      </Suspense>
    </div>

  );
}


export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}