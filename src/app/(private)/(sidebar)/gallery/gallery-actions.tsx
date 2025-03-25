"use client";

import { Eye, EllipsisVertical, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/ui.custom/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteGalleryTemplateAction } from "./actions";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Gallery } from "@/types/gallery";
import Link from "next/link";

export function GalleryActions({ gallery }: { gallery: Gallery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { execute, isPending } = useServerAction(deleteGalleryTemplateAction, {
    onSuccess() {
      setIsOpen(false);
    }
  });

  return (
    <>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Gallery Template"
        description="Are you sure you want to delete this gallery template? This action cannot be undone."
        onConfirm={() => {
          execute({
            id: gallery._id,
          });
        }}
        isPending={isPending}
      />

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className={cn(btnStyles)}
            asChild
          >
            <Link href={`/gallery/edit/${gallery._id}`}>
              <Eye className={btnIconStyles} />
              View & Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(btnStyles, "text-red-500")}
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon className={btnIconStyles} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}