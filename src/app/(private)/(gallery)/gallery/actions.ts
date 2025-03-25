'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createGalleryTemplate, saveGalleryTemplate } from '@/service/gallery-service';
import { adminOnlyAction, authenticatedAction } from '@/lib/safe-action';

// Define validation schema for gallery template data
const galleryTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dimensions: z.object({
    xAxis: z.number().min(5, "Width must be at least 5 units"),
    yAxis: z.number().min(5, "Height must be at least 5 units"),
    zAxis: z.number().min(5, "Depth must be at least 5 units")
  }),
  wallThickness: z.number().min(0.1, "Wall thickness must be at least 0.1 units"),
  wallHeight: z.number().min(1, "Wall height must be at least 1 unit"),
  modelPath: z.string().min(1, "Model path is required"),
  modelScale: z.number().min(0.1, "Model scale must be greater than 0"),
  modelRotation: z.tuple([z.number(), z.number(), z.number()]),
  modelPosition: z.tuple([z.number(), z.number(), z.number()]),
  previewImage: z.string().min(1, "Preview image is required"),
  planImage: z.string().min(1, "Plane image is required"),
  isPremium: z.boolean().default(false),
  customColliders: z.array(z.any()).optional(),
  artworkPlacements: z.array(
    z.object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      rotation: z.tuple([z.number(), z.number(), z.number()])
    })
  ).default([]),
});

export const createGalleryTemplateAction = adminOnlyAction
  .createServerAction()
  .input(galleryTemplateSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    const templateData = { ...input,
      customColliders: input.customColliders || [],
      artworkPlacements: input.artworkPlacements || [],
     };

     console.log('Saving gallery template2:', templateData);

    
    const res = await createGalleryTemplate(user.accessToken, templateData);
    return res.data;
  });

export const saveGalleryTemplateAction = authenticatedAction
  .createServerAction()
  .input(galleryTemplateSchema)
  .handler(async ({ input, ctx }) => {
    try {

      const templateData = { ...input };

      const savedData = {
        ...templateData,
        customColliders: templateData.customColliders || [],
        artworkPlacements: templateData.artworkPlacements || [],
      };
      const res = await saveGalleryTemplate(ctx.user.accessToken, savedData);
      const { gallery } = res.data!;
      revalidatePath(`/gallery`);
      if (gallery) {
        revalidatePath(`/gallery/edit/${gallery._id}`);
        return gallery;
      }
    } catch (error) {
      console.error('Error saving gallery template:', error);
      throw new Error('Failed to save gallery template');
    }
  });