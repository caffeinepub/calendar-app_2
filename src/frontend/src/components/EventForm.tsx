import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

interface EventFormProps {
  initialValues?: {
    title: string;
    description: string;
    date: string;
    time: string;
    reminder: boolean;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    reminder: boolean;
  }) => void;
  isSubmitting?: boolean;
}

export default function EventForm({ initialValues, onSubmit, isSubmitting }: EventFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState(initialValues?.date || '');
  const [time, setTime] = useState(initialValues?.time || '');
  const [reminder, setReminder] = useState(initialValues?.reminder || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setDate(initialValues.date);
      setTime(initialValues.time);
      setReminder(initialValues.reminder);
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({ title, description, date, time, reminder });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">
              Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={errors.time ? 'border-destructive' : ''}
            />
            {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event details..."
              rows={4}
            />
          </div>

          {/* Reminder */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder">Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Get notified 15 minutes before
              </p>
            </div>
            <Switch id="reminder" checked={reminder} onCheckedChange={setReminder} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialValues ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
}
