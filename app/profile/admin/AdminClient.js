'use client';

import Link from 'next/link';
import { Box, Heading, Text } from 'grommet';

import AdminGate from 'components/AdminGate';

const ADMIN_SECTIONS = [
  {
    href: '/profile/admin/email',
    title: 'Email',
    description: 'Send a generic email to one or more recipients.',
  },
  {
    href: '/profile/admin/events',
    title: 'Review Open Call',
    description: 'Review and approve Arti Night submissions.',
  },
  {
    href: '/profile/admin/cache',
    title: 'Clear Cache',
    description: 'Revalidate cached pages by path or tag.',
  },
];

export default function AdminClient() {
  return (
    <AdminGate title="Admin Dashboard">
      <Box direction="column" gap="medium">
        {ADMIN_SECTIONS.map(({ href, title, description }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <Box pad="medium" border={{ color: 'brand' }} round="small" fill="horizontal">
              <Heading level={3} margin="none">{title}</Heading>
              <Text>{description}</Text>
            </Box>
          </Link>
        ))}
      </Box>
    </AdminGate>
  );
}
