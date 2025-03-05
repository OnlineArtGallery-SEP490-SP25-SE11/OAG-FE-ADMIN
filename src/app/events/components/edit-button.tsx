'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateEventAction } from '../action';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
import { Card, CardContent } from '@/components/ui/card';
import { Pencil } from 'lucide-react';

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

// Updated schema
const editEventSchema = z.object({
  id: z.string(),
  image: z.instanceof(File).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  organizer: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type EventData = {
  _id: string;
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
      id: event._id,
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
      formData.append('id', event._id);

      if (data.image instanceof File) {
        if (data.image.size > MAX_UPLOAD_IMAGE_SIZE) {
          throw new Error(`Image size exceeds ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`);
        }
        formData.append('file', data.image);
      }
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.type) formData.append('type', data.type);
      if (data.status) formData.append('status', data.status);
      if (data.organizer) formData.append('organizer', data.organizer);
      if (data.startDate) formData.append('startDate', data.startDate);
      if (data.endDate) formData.append('endDate', data.endDate);

      return updateEventAction({
        id: event._id,
        image: formData,
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        organizer: data.organizer,
        startDate: data.startDate,
        endDate: data.endDate
      });
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

  const onSubmit: SubmitHandler<z.infer<typeof editEventSchema>> = (values  ) => {
    const data = {
      id: values.id,  
      image: values.image,
      title: values.title,
      description: values.description,
      type: values.type,
      status: values.status,
      organizer: values.organizer,
      startDate: values.startDate,
      endDate: values.endDate
    }
    mutate(data);
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
                Edit Event
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
                        {...form.register('startDate')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue={event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ''}
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
                        {...form.register('endDate')}
                        className="mt-2 h-12 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue={event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''}
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
                      if (file) {
                        if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
                          form.setError('image', {
                            type: 'manual',
                            message: `Image size must be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
                          });
                          return;
                        }
                        form.setValue('image', file);
                      }
                    }}
                  />
                  {event.image && (
                    <div className="mt-2">
                      <img
                        src={event.image}
                        alt="Current event image"
                        className="h-20 w-20 rounded-lg object-cover shadow-sm"
                      />
                    </div>
                  )}
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
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}