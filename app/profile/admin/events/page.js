import EventsCurateClient from './EventsCurateClient';

export const metadata = {
  title: 'Review Open Call - Arti Night',
  description: 'Review and approve Arti Night open call submissions.',
};

export default function AdminEventsPage() {
  return <EventsCurateClient />;
}
