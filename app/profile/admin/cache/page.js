import CacheClient from './CacheClient';

export const metadata = {
  title: 'Admin Cache - Arti',
  description: 'Revalidate cached pages.',
};

export default function AdminCachePage() {
  return <CacheClient />;
}
