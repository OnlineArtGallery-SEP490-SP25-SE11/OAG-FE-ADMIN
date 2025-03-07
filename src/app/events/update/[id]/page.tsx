'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, EventForm } from '../../schema';
import eventService from '@/service/event-service';
import FileUploader from '@/components/ui.custom/file-uploader';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { EventStatus } from '@/utils/enums';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  status: EventStatus;
  organizer: string;
  startDate: string;
  endDate: string;
}

interface UpdateEventPageProps {
  params: {
    id: string;
  };
}

export default function UpdateEventPage({ params }: UpdateEventPageProps) {
  const [isChangingImage, setIsChangingImage] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Lấy dữ liệu event bằng TanStack Query
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['event', params.id],
    queryFn: () => eventService.getById(params.id),
  });
  const event = data?.data;

  // Khởi tạo form với react-hook-form
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      type: '',
      status: EventStatus.UPCOMING,
      organizer: '',
      startDate: '',
      endDate: '',
    },
  });

  // Cập nhật giá trị form khi event thay đổi
  useEffect(() => {
    if (event) {
      console.log('Resetting form with event:', event);
      // Đảm bảo status luôn là một trong các giá trị enum hợp lệ
      const validStatus = Object.values(EventStatus).includes(event.status) 
        ? event.status 
        : EventStatus.UPCOMING;
        
      form.reset({
        title: event.title || '',
        description: event.description || '',
        image: event.image || '',
        type: event.type || '',
        status: validStatus,
        organizer: event.organizer || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      });
    }
  }, [event, form]);

  // Mutation để update event
  const mutation = useMutation({
    mutationFn: (data: EventForm) => {
      console.log('Submitting data:', data); // Thêm log để kiểm tra
      return eventService.update(data, params.id);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Event updated successfully!',
        variant: 'success',
      });
      router.push('/events/manage');
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update event',
        variant: 'destructive',
      });
      console.error('Error updating event:', error);
    },
  });

  // Xử lý submit form
  const onSubmit = (data: EventForm) => {
    // Đảm bảo status được giữ nguyên như chuỗi enum
    const submitData = {
      ...data,
      // Chuyển đổi lại ngày giờ về định dạng ISO
      startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
      endDate: data.endDate ? new Date(data.endDate).toISOString() : '',
    };
    
    console.log('Form data before submission:', submitData);
    mutation.mutate(submitData);

  };

  // Xử lý loading và error
  if (isLoading) return <div className="container mx-auto py-6">Loading...</div>;
  if (error || !event) return notFound();

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
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
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Event type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Event description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 3: Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {!isChangingImage && field.value ? (
                      <div className="flex items-center gap-4">
                        <Image
                          src={field.value}
                          alt="Current event image"
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsChangingImage(true)}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <FileUploader
                        accept={{ 'image/*': [] }}
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        onFileUpload={(files) => {
                          const file = files[0];
                          field.onChange(file.url);
                          setIsChangingImage(false);
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 4: Status & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value}
                      onValueChange={(value) => {
                        console.log('Selected status:', value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventStatus).map((status) => (
                          <SelectItem key={status} value={status} className={
                            status === EventStatus.UPCOMING ? 'text-blue-500' :
                            status === EventStatus.ONGOING ? 'text-green-500' :
                            'text-red-500'
                          }>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <FormControl>
                    <Input placeholder="Event organizer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 5: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="w-full"
                      {...field}
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
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto px-6"
            >
              {mutation.isPending ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}