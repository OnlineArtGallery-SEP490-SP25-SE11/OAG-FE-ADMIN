'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createEventAction } from '../action';
import { useRouter } from 'next/navigation';
import { motion} from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

const createEventSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
      message: `Image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
    }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  organizer: z.string().min(1, { message: 'Organizer is required' }),
  startDate: z.date(),
  endDate: z.date(),
});

export default function CreateEventButton() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof createEventSchema>) => {
      const formData = new FormData();
      formData.append('file', data.image);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('status', data.status);
      formData.append('organizer', data.organizer);
      formData.append('startDate', data.startDate.toISOString());
      formData.append('endDate', data.endDate.toISOString());

      return createEventAction({
        title: data.title,
        description: data.description,
        image: formData,
        type: data.type,
        status: data.status,
        organizer: data.organizer,
        startDate: data.startDate,
        endDate: data.endDate,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Event Created',
        description: 'Your event has been successfully created.',
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

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      image: undefined,
      title: '',
      description: '',
      type: '',
      status: '',
      organizer: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof createEventSchema>> = (values) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md transition-all duration-200"
        >
          {isPending ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <DialogHeader className="pt-6 px-6">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Create New Event
              </DialogTitle>
            </DialogHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-lg font-medium text-gray-700">
                        Title
                      </Label>
                      <Input
                        id="title"
                        {...form.register('title')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event title"
                      />
                      {form.formState.errors.title && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-lg font-medium text-gray-700">
                        Type
                      </Label>
                      <Input
                        id="type"
                        {...form.register('type')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event type"
                      />
                      {form.formState.errors.type && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.type.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-lg font-medium text-gray-700">
                        Status
                      </Label>
                      <Input
                        id="status"
                        {...form.register('status')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event status"
                      />
                      {form.formState.errors.status && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.status.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="organizer" className="text-lg font-medium text-gray-700">
                        Organizer
                      </Label>
                      <Input
                        id="organizer"
                        {...form.register('organizer')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter organizer name"
                      />
                      {form.formState.errors.organizer && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.organizer.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="text-lg font-medium text-gray-700">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        {...form.register('startDate', { setValueAs: (value) => new Date(value) })}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {form.formState.errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="endDate" className="text-lg font-medium text-gray-700">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        {...form.register('endDate', { setValueAs: (value) => new Date(value) })}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {form.formState.errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full-width fields */}
                <div>
                  <Label htmlFor="description" className="text-lg font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    className="mt-2 h-32 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your event"
                  />
                  {form.formState.errors.description && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="image" className="text-lg font-medium text-gray-700">
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) form.setValue('image', file);
                    }}
                  />
                  {form.formState.errors.image && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.image.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 text-lg rounded-lg"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 px-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200"
                  >
                    {isPending ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}