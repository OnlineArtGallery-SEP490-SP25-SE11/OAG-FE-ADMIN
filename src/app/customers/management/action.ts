"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const banCustomerAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        customerId: z.string(),
    }))
    .handler(async ({ input: { customerId } }) => {
        console.log('ban customer', customerId);
        // Implement your customer ban logic here
        revalidatePath("/customers/management");
    });

export const promoteToAdminAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        customerId: z.string(),
        role: z.enum(["admin", "moderator"]),
        permissions: z.array(z.string()),
    }))
    .handler(async ({ input: { customerId } }) => {
        try {
            console.log('promote to admin', customerId);
            // Implement your admin promotion logic here
            // This should update the user's role and permissions in your database

            // After successful promotion
            revalidatePath("/customers/management");

            return {
                success: true,
                message: "User promoted successfully"
            };
        } catch (error) {
            console.error("Failed to promote user to admin:", error);
            throw new Error("Failed to promote user to admin");
        }
    });