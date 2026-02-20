import { useGetAllEvents } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';

interface DailyViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DailyView({ selectedDate, onSelectDate }: DailyViewProps) {
  const { data: events } = useGetAllEvents();

  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onSelectDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onSelectDate(newDate);
  };

  const dateString = selectedDate.toISOString().split('T')[0];
  const dayEvents = events?.filter((event) => event.date === dateString) || [];

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          {isToday() && <p className="text-sm text-primary">Today</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Events List */}
      {dayEvents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">No events scheduled for this day</p>
            <Link
              to="/add-event"
              className="inline-block mt-4 text-sm text-primary hover:underline"
            >
              Add an event
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {dayEvents
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((event) => (
              <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatTime(event.time).split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(event.time).split(' ')[1]}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        {event.reminder && (
                          <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-blue-500/10 text-xs text-blue-600 dark:text-blue-400">
                            Reminder set
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
  );
}
