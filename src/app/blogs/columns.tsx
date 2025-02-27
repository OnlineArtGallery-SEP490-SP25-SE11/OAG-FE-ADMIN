"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogActions } from "./blog-actions";
import Image from "next/image";
import { Blog } from "@/types/blog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTags from "./edit-tags";
import { BlogStatus } from "@/utils/enums";

export const statusOptions = [
  {
    value: BlogStatus.PUBLISHED,
    label: "Published",
  },
  {
    value: BlogStatus.PENDING_REVIEW,
    label: "Pending",
  },
  {
    value: BlogStatus.DRAFT,
    label: "Draft",
  },
  {
    value: BlogStatus.REVIEW,
    label: "Review",
  },
  {
    value: BlogStatus.REJECTED,
    label: "Rejected",
  },
];

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Image
            src={row.getValue("image") || "/placeholder-blog.jpg"}
            alt={`${row.getValue("title")} thumbnail`}
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
      const author = row.getValue("author") as Blog["author"];
      return <div className="font-medium">{author.name}</div>;
    },
  },
  {
    accessorKey: "views",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-center"
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const views = row.getValue("views") as number;
      return <div className="font-medium text-center">{views}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full font-semibold text-center"
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      return <div className="font-medium text-center">{new Date(updatedAt).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-full flex justify-center">
              Status
              <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={(column.getFilterValue() as string[] ?? []).includes(option.value)}
                onCheckedChange={(checked) => {
                  const filterValues = column.getFilterValue() as string[] ?? [];
                  if (checked) {
                    column.setFilterValue([...filterValues, option.value]);
                  } else {
                    column.setFilterValue(
                      filterValues.filter((value) => value !== option.value)
                    );
                  }
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as "pending" | "published";
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      };

      return (
        <Badge
          className={`${statusStyles[status || 'pending']} font-medium mx-auto`}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true; // If no filters selected, show all
      const status = row.getValue(id) as string;
      return value.includes(status || 'pending');
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