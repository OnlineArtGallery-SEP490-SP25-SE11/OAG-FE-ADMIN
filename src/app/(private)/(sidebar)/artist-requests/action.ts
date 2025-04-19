"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { approveArtistRequest, deleteArtistRequest, rejectArtistRequest } from "@/service/artist-request-service";

export const approveArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string(),
  }))
  .handler(async ({ input: { requestId }, ctx }) => {
    const _approvedRequest = await approveArtistRequest({
      accessToken: ctx.user.accessToken,
      requestId,
    });
    console.log("Approved request", _approvedRequest);
    revalidatePath("/artist-requests");
  });

export const rejectArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string(),
    reason: z.string(),
  }))
  .handler(async ({ input: { requestId, reason }, ctx }) => {
    const _rejectedRequest = await rejectArtistRequest({
      accessToken: ctx.user.accessToken,
      requestId,
      reason,
    });
    console.log("Rejected request", _rejectedRequest);
    revalidatePath("/artist-requests");
  });

  // Add this action alongside the existing approve/reject actions

export const deleteArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string()
  }))
  .handler(async ({
    input: { requestId },
    ctx: { },
  }) => {
    await deleteArtistRequest(requestId);
    revalidatePath("/artist-requests");
  });