import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateEvent } from '../hooks/useQueries';
import EventForm from '../components/EventForm';
import { toast } from 'sonner';

export default function AddEvent() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    reminder: boolean;
  }) => {
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await createEvent.mutateAsync({ ...data, id });
      toast.success('Event created successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Add Event
        </h1>
        <p className="text-muted-foreground mt-1">Create a new event</p>
      </div>

      <EventForm onSubmit={handleSubmit} isSubmitting={createEvent.isPending} />
    </div>
  );
}
