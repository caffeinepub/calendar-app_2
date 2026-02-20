import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import AddEvent from './pages/AddEvent';
import EventDetails from './pages/EventDetails';
import EventEdit from './pages/EventEdit';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { useNotifications } from './hooks/useNotifications';

// Layout component that includes the bottom navigation
function AppLayout() {
  useNotifications();
  return <Layout><Outlet /></Layout>;
}

// Define routes
const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: Calendar,
});

const addEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-event',
  component: AddEvent,
});

const eventDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$id',
  component: EventDetails,
});

const eventEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$id/edit',
  component: EventEdit,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  calendarRoute,
  addEventRoute,
  eventDetailsRoute,
  eventEditRoute,
  settingsRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
