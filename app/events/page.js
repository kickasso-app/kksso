import { redirect } from 'next/navigation';
import DEFAULT_CITY from 'config/default-city';

export default function EventsIndex() {
  redirect(`/events/${DEFAULT_CITY}`);
}
