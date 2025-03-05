export default function EditEvent({event}:{event:any}){
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
       
}