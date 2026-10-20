import EmailClient from './EmailClient';

export const metadata = {
  title: 'Admin Email - Arti',
  description: 'Send a generic email.',
};

export default function AdminEmailPage() {
  return <EmailClient />;
}
