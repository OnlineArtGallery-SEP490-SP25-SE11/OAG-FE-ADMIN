'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateEventAction } from '../action';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

// Updated schema with more comprehensive validation
const editEventSchema = z.object({
  id: z.string(),
  image: z.instanceof(File).optional(),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100, { message: "Title must be less than 100 characters" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000, { message: "Description must be less than 1000 characters" }).optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  organizer: z.string().min(2, { message: "Organizer name must be at least 2 characters" }).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(data => !data.endDate || !data.startDate || new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

type EventData = {
  title: string;
  image?: string;
  description: string;
  type: string;
  status: string;
  organizer: string;
  startDate: string;
  endDate: string;
};

interface EditEventButtonProps {
  event: EventData;
}

export default function EditEventButton({ event }: EditEventButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editEventSchema>>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      type: event.type,
      status: event.status,
      organizer: event.organizer,
      startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editEventSchema>) => {
      const formData = new FormData();
    //   formData.append('id', event._id);
  
      if (data.image instanceof File) {
        if (data.image.size > MAX_UPLOAD_IMAGE_SIZE) {
          throw new Error(`Image size exceeds ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`);
        }
        formData.append('file', data.image);
      }
  
      // Only append non-empty fields
      Object.entries(data).forEach(([key, value]) => {
        if (value && key !== 'id' && key !== 'image') {
          formData.append(key, value.toString());
        }
      });
  
      return updateEventAction(formData);
    },
    onSuccess: () => {
      toast({
        title: 'Event Updated',
        description: 'Your event has been successfully updated.',
        variant: 'success',
        className: 'bg-green-600 text-white border-none text-lg py-3',
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
        className: 'bg-red-600 text-white border-none text-lg py-3',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof editEventSchema>) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <DialogHeader className="pt-6 px-6">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Edit Event
              </DialogTitle>
            </DialogHeader>
            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter event title" 
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">Type</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter event type" 
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">Status</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter event status" 
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="organizer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">Organizer</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter organizer name" 
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">Start Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local"
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium text-gray-700">End Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local"
                                {...field} 
                                className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Full-width Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-gray-700">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your event" 
                            {...field} 
                            className="h-32 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-gray-700">Image</FormLabel>
                        <FormControl>
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
                                  form.setError('image', {
                                    type: 'manual',
                                    message: `Image size must be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
                                  });
                                  return;
                                }
                                onChange(file);
                              }
                            }}
                            className="h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        {event.image && (
                          <div className="mt-2">
                            <img
                              src={event.image}
                              alt="Current event image"
                              className="h-20 w-20 rounded-lg object-cover shadow-sm"
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6 text-lg rounded-lg"
                      onClick={() => {
                        form.reset();
                        setOpen(false);
                      }}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !form.formState.isDirty}
                      className="h-12 px-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
                    >
                      {isPending ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}