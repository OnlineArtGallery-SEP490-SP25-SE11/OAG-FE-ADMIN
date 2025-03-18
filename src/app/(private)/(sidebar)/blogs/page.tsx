import { Suspense } from "react";
import { BlogsTable, TableSkeleton } from "./blog-table";
import { Breadcrumb } from "@/components/ui.custom/breadcrumb";
import { CreateBlogButton } from "./create-blog-button";
import { ErrorBoundary } from "@/components/error-boundary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", link: "/admin" },
            { label: "Blogs" }
          ]}
        />
        <CreateBlogButton />
      </div>
      <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <BlogsTable searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}