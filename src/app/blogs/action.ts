/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deleteBlog } from "@/service/blog-service";

export const deleteBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string()
  }))

  .handler(async ({
    input: { blogId },

    ctx: { },
  }) => {
    await deleteBlog(blogId);
    revalidatePath("/blogs");
  });

export const approveBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
  }))
  .handler(async ({ input: { blogId, title, tags } }) => {
    // Implement your blog approval logic here
    // This might include updating the blog status, title, and tags
    revalidatePath("/blogs");
  });

export const rejectBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string(),
    reason: z.string(),
  }))
  .handler(async ({ input: { blogId, reason } }) => {
    // Implement your blog rejection logic here
    // This might include updating the blog status and storing the rejection reason
    revalidatePath("/blogs");
  });


