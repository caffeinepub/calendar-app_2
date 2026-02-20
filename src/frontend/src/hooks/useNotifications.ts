import { useEffect, useRef } from 'react';
import { useGetAllEvents } from './useQueries';
import { checkNotificationPermission, requestNotificationPermission, showNotification } from '../utils/notificationHelpers';

export function useNotifications() {
  const { data: events } = useGetAllEvents();
  const shownNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!events || events.length === 0) return;

    const checkUpcomingEvents = () => {
      const now = new Date();
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

      events.forEach((event) => {
        if (!event.reminder) return;
        if (shownNotificationsRef.current.has(event.id)) return;

        const eventDateTime = new Date(`${event.date}T${event.time}`);
        
        // Show notification if event is within 15 minutes
        if (eventDateTime > now && eventDateTime <= fifteenMinutesFromNow) {
          const permission = checkNotificationPermission();
          
          if (permission === 'granted') {
            showNotification(event);
            shownNotificationsRef.current.add(event.id);
          } else if (permission === 'default') {
            requestNotificationPermission().then((result) => {
              if (result === 'granted') {
                showNotification(event);
                shownNotificationsRef.current.add(event.id);
              }
            });
          }
        }
      });
    };

    // Check immediately
    checkUpcomingEvents();

    // Check every minute
    const interval = setInterval(checkUpcomingEvents, 60000);

    return () => clearInterval(interval);
  }, [events]);
}
