"use client";

import { EllipsisVertical, Eye, TrashIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteModal } from "@/components/ui.custom/delete-modal";
import { useServerAction } from "zsa-react";
import { deleteExhibitionAction } from "./action";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { InteractiveOverlay } from "@/components/ui.custom/interactive-overlay";
import { ApproveExhibitionForm } from "./approve-exhibition-form";
import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import Link from "next/link";

export function ExhibitionActions({ exhibition }: { exhibition: Exhibition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditExhibitionOpen, setIsEditExhibitionOpen] = useState(false);

  const { execute, isPending } = useServerAction(deleteExhibitionAction, {
    onSuccess() {
      setIsOpen(false);
    }
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        isOpen={isEditExhibitionOpen}
        setIsOpen={setIsEditExhibitionOpen}
        title={""}
        description={""}
        form={<ApproveExhibitionForm exhibition={exhibition} setIsOpen={setIsEditExhibitionOpen} />}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Exhibition"
        description="Are you sure you want to delete this exhibition? This action cannot be undone."
        onConfirm={() => {
          execute({
            exhibitionId: exhibition._id,
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
          <Link href={`/exhibitions/preview/${exhibition._id}`} passHref>
            <DropdownMenuItem className={cn(btnStyles, "text-gray-500")}>
              <ExternalLink className={btnIconStyles} />
              Preview
            </DropdownMenuItem>
          </Link>

          {exhibition.status === ExhibitionStatus.PENDING && (
            <DropdownMenuItem
              className={cn(btnStyles)}
              onClick={() => {
                setIsEditExhibitionOpen(true);
              }}
            >
              <Eye className={btnIconStyles} />
              Review
            </DropdownMenuItem>
          )}
          
          {/* <Link href={`/exhibitions/edit/${exhibition._id}`} passHref>
            <DropdownMenuItem className={btnStyles}>
              <Eye className={btnIconStyles} />
              Edit
            </DropdownMenuItem>
          </Link> */}
          
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