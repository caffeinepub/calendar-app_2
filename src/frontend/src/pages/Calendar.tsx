import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MonthlyView from '../components/MonthlyView';
import WeeklyView from '../components/WeeklyView';
import DailyView from '../components/DailyView';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">View and manage your events</p>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Month</TabsTrigger>
          <TabsTrigger value="weekly">Week</TabsTrigger>
          <TabsTrigger value="daily">Day</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-6">
          <MonthlyView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <WeeklyView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </TabsContent>
        
        <TabsContent value="daily" className="mt-6">
          <DailyView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
