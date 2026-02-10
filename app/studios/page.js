import { redirect } from 'next/navigation';
import DEFAULT_REGION from 'config/default-region';

export default function StudiosIndex() {
  redirect(`/studios/${DEFAULT_REGION}`);
}
