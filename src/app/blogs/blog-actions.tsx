"use client";

import { EllipsisVertical, Eye, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/ui.custom/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteBlogAction } from "./action";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { InteractiveOverlay } from "@/components/ui.custom/interactive-overlay";
import { ApproveBlogForm } from "./approve-blog-form";
import { Blog } from "@/types/blog";


export function BlogActions({ blog }: { blog: Blog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditCharmOpen, setIsEditCharmOpen] = useState(false);


  const { execute, isPending } = useServerAction(deleteBlogAction, {
    onSuccess() {
      setIsOpen(false);
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        isOpen={isEditCharmOpen}
        setIsOpen={setIsEditCharmOpen}
        title={""}
        description={""}
        form={<ApproveBlogForm blog={blog} setIsOpen={setIsEditCharmOpen} />}
      />


      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={() => {
          execute({
            blogId: blog._id,
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
            onClick={() => {
              setIsEditCharmOpen(true);
            }}
            className={btnStyles}

          >
            <Eye className={btnIconStyles} />
            Review
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