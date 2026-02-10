import { redirect } from 'next/navigation';
import DEFAULT_REGION from 'config/default-region';

export default function EventsIndex() {
  redirect(`/events/${DEFAULT_REGION}`);
}
