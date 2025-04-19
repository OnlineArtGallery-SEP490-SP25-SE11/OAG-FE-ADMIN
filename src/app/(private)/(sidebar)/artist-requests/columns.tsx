"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArtistRequest } from "@/types/artist-request";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArtistRequestActions } from "./artist-request-actions";

export const columns: ColumnDef<ArtistRequest>[] = [
  {
    accessorKey: "user._id",
    header: "User ID",
    cell: ({ row }) => <span>{row.original.user._id}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "ID Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "APPROVED"
            ? "destructive"
            : row.original.status === "REJECTED"
            ? "secondary"
            : "default"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPp"),
  },
  {
    id: "actions",
    cell: ({ row }) => <ArtistRequestActions request={row.original} />,
  },
];