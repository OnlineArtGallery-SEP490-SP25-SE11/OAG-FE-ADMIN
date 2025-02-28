"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogStatus } from "@/utils/enums";
import { Column } from "@tanstack/react-table";

// Status options for dropdown filter
export const statusOptions = [
    { value: BlogStatus.PUBLISHED, label: "Published" },
    { value: BlogStatus.PENDING_REVIEW, label: "Pending" },
    { value: BlogStatus.DRAFT, label: "Draft" },
    { value: BlogStatus.REVIEW, label: "Review" },
    { value: BlogStatus.REJECTED, label: "Rejected" },
];

// SortableHeader - handles sort logic with proper hook usage
export function SortableHeader({
    column,
    title,
    fieldName
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
    title: string;
    fieldName: string;
}) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isSorted = column.getIsSorted();

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortField', fieldName);

        if (isSorted === 'asc') {
            params.set('sortOrder', 'desc');
        } else {
            params.set('sortOrder', 'asc');
        }

        // Reset to page 1 when sorting changes
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Button
            variant="ghost"
            onClick={handleSort}
            className={fieldName === 'title' ? "p-0 hover:bg-transparent" : "w-full font-semibold text-center"}
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

// StatusFilterHeader - handles filtering by status
export function StatusFilterHeader({
    column
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column: Column<any, unknown>;
}) {

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
}