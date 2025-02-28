"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BlogActions } from "./blog-actions";
import Image from "next/image";
import { Blog } from "@/types/blog";
import EditTags from "./edit-tags";
import { SortableHeader, StatusFilterHeader, statusOptions } from "./column-headers";

export { statusOptions };

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original?.title;
      return <div className="font-medium">{title || "Unknown"}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => {
      const image = row.original?.image || "/placeholder-blog.jpg";
      const title = row.original?.title || "Blog thumbnail";
      
      return (
        <div className="flex justify-center">
          <Image
            src={image}
            alt={title}
            width={80}
            height={45}
            className="rounded-md object-cover border border-gray-200 dark:border-gray-700"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original?.author;
      return <div className="font-medium">{author?.name || "Unknown"}</div>;
    },
  },
  {
    accessorKey: "views",
    header: ({ column }) => <SortableHeader column={column} title="Views" fieldName="views" />,
    cell: ({ row }) => {
      const views = row.original?.views || 0;
      return <div className="font-medium text-center">{views}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <SortableHeader column={column} title="Updated At" fieldName="updatedAt" />,
    cell: ({ row }) => {
      const updatedAt = row.original?.updatedAt;
      return <div className="font-medium text-center">
        {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
      </div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <StatusFilterHeader column={column} />,
    cell: ({ row }) => {
      const status = row.original?.status || "DRAFT";
      
      // Map status to colors
      const statusStyles = {
        PUBLISHED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        PENDING_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
        REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      };

      return (
        <Badge
          className={`${statusStyles[status] || statusStyles.DRAFT} font-medium mx-auto`}
        >
          {status.replace('_', ' ')}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true; // If no filters selected, show all
      const status = row.getValue(id) as string;
      return value.includes(status || 'DRAFT');
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <div className="flex justify-center gap-2">
          <EditTags blogId={blog._id} currentTags={blog.tags} />
          <BlogActions blog={blog} />
        </div>
      );
    },
  }
];