"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/types/gallery";

export const columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="h-16 w-16 relative rounded-md overflow-hidden">
          {template.previewImage ? (
            <Image
              src={template.previewImage}
              alt={template.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-xs">No preview</p>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div>
          <p className="font-medium">{template.name}</p>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dimensions",
    header: "Dimensions",
    cell: ({ row }) => {
      const template = row.original;
      return (
        <Badge variant="secondary">
          {template.dimensions.xAxis}x{template.dimensions.zAxis}m
        </Badge>
      );
    },
  },
  {
    accessorKey: "wallHeight",
    header: "Wall Height",
    cell: ({ row }) => {
      return <span>{row.original.wallHeight}m</span>;
    },
  },
  {
    accessorKey: "modelPath",
    header: "Model",
    cell: ({ row }) => {
      return <span>{row.original.modelPath.split('/').pop()}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/gallery/edit/${template._id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];