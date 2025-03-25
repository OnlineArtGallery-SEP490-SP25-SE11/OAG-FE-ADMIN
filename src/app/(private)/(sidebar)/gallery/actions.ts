'use server';

import { adminOnlyAction } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { deleteGalleryTemplate } from '@/service/gallery-service';

export const deleteGalleryTemplateAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    id: z.string()
  }))
  .handler(async ({ input: { id }, ctx }) => {
    try {
      await deleteGalleryTemplate(ctx.user.accessToken, id);
      revalidatePath('/gallery');
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery template:', error);
      throw new Error('Failed to delete gallery template');
    }
  });