import type { Event } from '../backend';

export function checkNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return await Notification.requestPermission();
}

export function showNotification(event: Event): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const eventTime = new Date(`${event.date}T${event.time}`);
  const timeString = eventTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  new Notification(event.title, {
    body: `Upcoming event at ${timeString}`,
    icon: '/assets/generated/app-icon.dim_512x512.png',
    badge: '/assets/generated/app-icon.dim_512x512.png',
  });
}

export function calculateTimeUntilEvent(date: string, time: string): number {
  const eventDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  return eventDateTime.getTime() - now.getTime();
}
