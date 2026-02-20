import { useGetAllEvents } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { type ReactNode } from 'react';

interface MonthlyViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function MonthlyView({ selectedDate, onSelectDate }: MonthlyViewProps) {
  const { data: events } = useGetAllEvents();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    onSelectDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onSelectDate(new Date(year, month + 1, 1));
  };

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const hasEventsOnDate = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    return events?.some((event) => event.date === dateString);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const days: ReactNode[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvents = hasEventsOnDate(day);
    const today = isToday(day);
    
    days.push(
      <button
        key={day}
        onClick={() => onSelectDate(new Date(year, month, day))}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all hover:bg-accent relative ${
          today ? 'bg-primary text-primary-foreground font-bold' : ''
        }`}
      >
        <span className="text-sm">{day}</span>
        {hasEvents && (
          <div className={`w-1 h-1 rounded-full mt-1 ${today ? 'bg-primary-foreground' : 'bg-primary'}`} />
        )}
      </button>
    );
  }

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const selectedDateEvents = events?.filter((event) => event.date === selectedDateString) || [];

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground pb-2">
                {day}
              </div>
            ))}
            {days}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDateEvents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">
            Events on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h3>
          {selectedDateEvents
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((event) => (
              <Link key={event.id} to="/events/$id" params={{ id: event.id }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
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
