import { Button } from "@/components/ui/button";
import { Customer } from "./columns";
import { EllipsisVertical, ShieldCheck, BanIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { btnStyles, btnIconStyles } from "@/styles/icons";

export function CustomerActions({ customer }: { customer: Customer }) {
    console.log(customer);
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <EllipsisVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    className={cn(btnStyles, "hover:bg-slate-100 dark:hover:bg-slate-800")}
                >
                    <ShieldCheck className={cn(btnIconStyles, "text-green-500")} />
                    Promote to Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={cn(btnStyles, "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50")}
                >
                    <BanIcon className={btnIconStyles} />
                    Ban User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

