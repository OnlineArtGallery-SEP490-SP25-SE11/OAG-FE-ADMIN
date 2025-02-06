import { Breadcrumb } from "@/components/ui.custom/breadcrumb";
import { BlogsTable } from "./blogs-table";
import { CreateBlogButton } from "./create-blog-button";

export default async function BlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Blogs" }]} />
        <CreateBlogButton />
      </div>
      <BlogsTable />
    </div>
  );
}