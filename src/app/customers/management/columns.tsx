"use client";

import { CustomerActions } from "./customer-action";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";

export interface Customer {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'active' | 'inactive' | 'banned';
    joinDate: string;
    lastLogin: string;
    role: 'admin' | 'user' | 'moderator';
    accountType: 'free' | 'premium' | 'enterprise';
    phoneNumber?: string;
}

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: () => (
            <Button
                variant="ghost"
                className="w-full font-semibold text-left pl-4"
            >
                Name
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="flex justify-center items-center gap-3 pl-4">
                    <div className="h-10 w-10 relative rounded-full overflow-hidden">
                        <Image
                            src={row.original.avatar}
                            alt={row.getValue("name")}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-medium">{row.getValue("name")}</div>
                        <div className="text-sm text-gray-500">{row.original.email}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusStyles = {
                active: "bg-green-100 text-green-800",
                inactive: "bg-gray-100 text-gray-800",
                banned: "bg-red-100 text-red-800",
            };

            return (
                <Badge
                    className={`${statusStyles[status as keyof typeof statusStyles]} font-medium mx-auto`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "joinDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Join Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("joinDate"));
            return <div className="font-medium text-center">{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const roleStyles = {
                admin: "bg-purple-100 text-purple-800",
                moderator: "bg-blue-100 text-blue-800",
                user: "bg-gray-100 text-gray-800",
            };

            return (
                <Badge
                    className={`${roleStyles[role as keyof typeof roleStyles]} font-medium mx-auto`}
                >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "accountType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Plan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const plan = row.getValue("accountType") as string;
            const planStyles = {
                free: "bg-gray-100 text-gray-800",
                premium: "bg-yellow-100 text-yellow-800",
                enterprise: "bg-blue-100 text-blue-800",
            };

            return (
                <Badge
                    className={`${planStyles[plan as keyof typeof planStyles]} font-medium mx-auto`}
                >
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "lastLogin",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full font-semibold text-center"
                >
                    Last Login
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("lastLogin"));
            return <div className="font-medium text-center">{date.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <div className="flex justify-center">
                    <CustomerActions customer={customer} />
                </div>
            );
        },
    }
];