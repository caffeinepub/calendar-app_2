import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEvent, useUpdateEvent } from '../hooks/useQueries';
import EventForm from '../components/EventForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EventEdit() {
  const { id } = useParams({ from: '/events/$id/edit' });
  const navigate = useNavigate();
  const { data: event, isLoading } = useGetEvent(id);
  const updateEvent = useUpdateEvent();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    reminder: boolean;
  }) => {
    try {
      await updateEvent.mutateAsync({ ...data, id });
      toast.success('Event updated successfully!');
      navigate({ to: `/events/${id}` });
    } catch (error) {
      toast.error('Failed to update event. Please try again.');
      console.error('Error updating event:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit Event
        </h1>
        <p className="text-muted-foreground mt-1">Update event details</p>
      </div>

      <EventForm
        initialValues={{
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          reminder: event.reminder,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateEvent.isPending}
      />
    </div>
  );
}
