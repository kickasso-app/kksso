import { redirect } from 'next/navigation';
import DEFFAULT_CITY from "config/default-city";

export default function EditorialPage() {
  redirect(`/editorial/${DEFFAULT_CITY}`);
}
