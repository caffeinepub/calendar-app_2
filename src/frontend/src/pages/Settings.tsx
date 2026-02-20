import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Bell, Cloud } from 'lucide-react';
import { checkNotificationPermission, requestNotificationPermission } from '../utils/notificationHelpers';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SiX } from 'react-icons/si';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setNotificationPermission(checkNotificationPermission());
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notifications enabled');
      } else {
        toast.error('Notification permission denied');
      }
    } else {
      toast.info('Notifications disabled');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage event reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-toggle">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified 15 minutes before events
              </p>
            </div>
            <Switch
              id="notifications-toggle"
              checked={notificationPermission === 'granted'}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
          {notificationPermission === 'denied' && (
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cloud Sync (Coming Soon) */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Cloud Sync
          </CardTitle>
          <CardDescription>Sync your events across devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync-toggle" className="text-muted-foreground">
                Enable Cloud Sync
              </Label>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
            <Switch id="sync-toggle" disabled />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* App Info */}
      <div className="text-center space-y-2 py-4">
        <p className="text-sm text-muted-foreground">Calendar App v1.0.0</p>
        <p className="text-xs text-muted-foreground">
          Built with <span className="text-red-500">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
