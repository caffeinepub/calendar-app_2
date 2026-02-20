import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Event } from '../backend';

export function useGetAllEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEvent(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getEvent(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      date: string;
      time: string;
      reminder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createEvent(data.id, data.title, data.description, data.date, data.time, data.reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      date: string;
      time: string;
      reminder: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateEvent(data.id, data.title, data.description, data.date, data.time, data.reminder);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
