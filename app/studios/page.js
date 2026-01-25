import { redirect } from 'next/navigation';
import DEFAULT_CITY from 'config/default-city';

export default function StudiosIndex() {
  redirect(`/studios/${DEFAULT_CITY}`);
}
