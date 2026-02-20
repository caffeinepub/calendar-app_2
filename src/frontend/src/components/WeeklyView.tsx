import { useGetAllEvents } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';

interface WeeklyViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function WeeklyView({ selectedDate, onSelectDate }: WeeklyViewProps) {
  const { data: events } = useGetAllEvents();

  const getWeekDays = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const sunday = new Date(date);
    sunday.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onSelectDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onSelectDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events?.filter((event) => event.date === dateString) || [];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekRange = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{weekRange}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="space-y-4">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDate(day);
          const today = isToday(day);

          return (
            <Card key={day.toISOString()} className={today ? 'border-primary' : ''}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 text-center ${today ? 'text-primary' : ''}`}>
                    <div className="text-xs font-medium">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-2xl font-bold ${today ? 'bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mx-auto mt-1' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events</p>
                    ) : (
                      dayEvents
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
                            <div className="p-2 rounded-md bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{event.title}</span>
                                <span className="text-xs text-muted-foreground">{event.time}</span>
                              </div>
                            </div>
                          </Link>
                        ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
