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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Calendar, Clock, Link as LinkIcon, Users, Tag, Info, InfoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface UpdateEventPageProps {
  params: {
    id: string;
  };
}

export default function UpdateEventPage({ params }: UpdateEventPageProps) {
  const [isChangingImage, setIsChangingImage] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', params.id],
    queryFn: () => eventService.getById(params.id),
  });
  const event = data?.data;

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      type: '',
      status: event?.status,
      organizer: '',
      startDate: '',
      endDate: '',
      link: '',
    },
  });

  useEffect(() => {
    if (event) {
      console.log("Event status from API:", event.status);
      
      // Ensure the status is a valid enum value and convert to string if needed
      const validStatus = Object.values(EventStatus).includes(event.status as EventStatus) 
        ? event.status 
        : EventStatus.UPCOMING;
      
      console.log("Valid status determined:", validStatus);
      
      // Set form values
      form.reset({
        title: event.title || '',
        description: event.description || '',
        image: event.image || '',
        type: event.type || '',
        status: validStatus,
        organizer: event.organizer || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        link: event.link || '',
      });
      console.log('status',validStatus)
      // Force update the status field specifically
      form.setValue('status', validStatus);
    }
  }, [event, form]);

  const mutation = useMutation({
    mutationFn: (data: EventForm) => {
      return eventService.update(data, params.id);
    },
    onSuccess: () => {
      toast({
        title: 'Event Updated',
        description: 'Your event has been updated successfully!',
        className: 'bg-green-500 text-white border-green-600',
        duration: 2000,
      });
      router.push('/events/manage');
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Something went wrong while updating the event',
        className: 'bg-red-500 text-white border-red-600',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: EventForm) => {
    const submitData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
      endDate: data.endDate ? new Date(data.endDate).toISOString() : '',
    };
    
    mutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading event data...</p>
      </div>
    );
  }
  
  if (error || !event) return notFound();

  const getStatusColor = (status: string) => {
    switch(status) {
      case EventStatus.UPCOMING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EventStatus.ONGOING: return 'bg-green-100 text-green-800 border-green-200';
      case EventStatus.COMPLETED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground">Update your event details and settings</p>
        </div>
        <div className="hidden sm:block">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium border",
            getStatusColor(form.getValues('status'))
          )}>
            {form.getValues('status')}
          </span>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-1">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic" className="text-sm">
              <Info className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Basic Information</span>
              <span className="sm:hidden">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Event Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="text-sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Media & Links</span>
              <span className="sm:hidden">Media</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Event Information</CardTitle>
                  <CardDescription>Enter the basic details of your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter event title" {...field} className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                          const [isCustomType, setIsCustomType] = useState(false);
                          
                          // Handle either dropdown selection or custom input
                          const handleTypeChange = (value: string) => {
                            if (value === 'custom') {
                              setIsCustomType(true);
                              // Don't update field value yet, wait for custom input
                            } else {
                              field.onChange(value);
                              setIsCustomType(false);
                            }
                          };
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Event Type</FormLabel>
                              <FormControl>
                                {isCustomType ? (
                                  <div className="relative">
                                    <Input 
                                      placeholder="Enter custom event type" 
                                      className="h-12 pl-10"
                                      value={field.value} 
                                      onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <InfoIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      size="sm" 
                                      className="absolute right-2 top-3 h-6"
                                      onClick={() => setIsCustomType(false)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <Select 
                                    value={field.value} 
                                    onValueChange={handleTypeChange}
                                  >
                                    <SelectTrigger className="h-12 pl-10">
                                      <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <InfoIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <SelectContent>
                                      <SelectItem value="thematic exhibitions">Thematic Exhibitions</SelectItem>
                                      <SelectItem value="solo exhibitions">Solo Exhibitions</SelectItem>
                                      <SelectItem value="group exhibitions">Group Exhibitions</SelectItem>
                                      <SelectItem value="artist talks">Artist Talks</SelectItem>
                                      <SelectItem value="workshop">Workshop</SelectItem>
                                      <SelectItem value="memorial Exhibitions">Memorial Exhibitions</SelectItem>
                                      <SelectItem value="honorary exhibitions">Honorary Exhibitions</SelectItem>
                                      <SelectItem value="custom">Enter Custom Type...</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your event"
                            className="min-h-[150px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status & Organizer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => {
                        
                        return (
                          <FormItem>
                            <FormLabel>Event Status</FormLabel>
                            <FormControl>
                              <Select 
                                value={field.value || EventStatus.UPCOMING} // Provide fallback value
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue>
                                    {field.value || "Select event status"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(EventStatus).map((validStatus) => (
                                    <SelectItem key={validStatus} value={validStatus} className={
                                      validStatus === EventStatus.UPCOMING ? 'text-blue-600 font-medium' :
                                      validStatus === EventStatus.ONGOING ? 'text-green-600 font-medium' :
                                      'text-red-600 font-medium'
                                    }>
                                      {validStatus}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer</FormLabel>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="Organization or person name" {...field} className="h-10" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Date & Time</CardTitle>
                  <CardDescription>Set when your event starts and ends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Media & Links</CardTitle>
                  <CardDescription>Add visual elements and related links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {!isChangingImage && field.value ? (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="border rounded-lg overflow-hidden bg-gray-50 h-48 w-full sm:w-64 relative">
                                  <Image
                                    src={field.value}
                                    alt="Event cover image"
                                    fill
                                    sizes="(max-width: 640px) 100vw, 256px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsChangingImage(true)}
                                    className="sm:w-auto"
                                  >
                                    Change Image
                                  </Button>
                                  <p className="text-xs text-muted-foreground">
                                    For best results, use an image at least 1200×600 pixels
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="border rounded-lg p-6 bg-gray-50">
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
                                <p className="text-xs text-muted-foreground mt-2">
                                  Recommended size: 1200×600 pixels, max 5MB
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  {/* External Link */}
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Link</FormLabel>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/event" 
                              type="url" 
                              className="h-10"
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Optional: Add a link to the event page on an external website
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Action Buttons - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
              <div className="container mx-auto max-w-5xl flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="min-w-[120px]"
                >
                  {mutation.isPending ? 
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      Updating...
                    </span> : 
                    'Update Event'
                  }
                </Button>
              </div>
            </div>
            
            {/* This is to add space at the bottom so content isn't hidden behind fixed buttons */}
            <div className="h-20"></div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}