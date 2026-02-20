import { useGetAllEvents } from '../hooks/useQueries';
import { Calendar, Clock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: events, isLoading } = useGetAllEvents();

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const todayEvents = events?.filter((event) => event.date === todayString) || [];
  
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {greeting()}
        </h1>
        <p className="text-muted-foreground">{formatDate(today)}</p>
      </div>

      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20 dark:border-purple-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Events</p>
              <p className="text-4xl font-bold text-primary">{todayEvents.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Schedule</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : todayEvents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No events scheduled for today</p>
              <Link
                to="/add-event"
                className="inline-block mt-4 text-sm text-primary hover:underline"
              >
                Add your first event
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayEvents
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((event) => (
                <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {formatTime(event.time).split(' ')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(event.time).split(' ')[1]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {event.description}
                            </p>
                          )}
                          {event.reminder && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400">
                              <Clock className="w-3 h-3" />
                              <span>Reminder set</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
