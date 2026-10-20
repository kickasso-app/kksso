'use client';

import Link from 'next/link';
import { ChevronLeft } from 'react-feather';
import { Box, Heading, Text } from 'grommet';

import { useAuth } from 'services/auth';

export default function AdminGate({ title, backHref, children }) {
  const { user } = useAuth();

  // Same rule as the server (services/admin.server.js): app_metadata cannot be edited by users.
  // This only decides what to show; every admin API route checks the role again.
  const role = user?.app_metadata?.role;
  if (!user || role !== 'manager') {
    return (
      <Box pad="large" align="center">
        <Heading level={3}>Access Denied</Heading>
        <Text>You must be a manager to view this page.</Text>
        <Text size="small" color="status-disabled">Current role: {role || 'none'}</Text>
      </Box>
    );
  }

  return (
    <Box pad="large" gap="large">
      {backHref && (
        <Box direction="row" align="center">
          <ChevronLeft size={16} /> <Link href={backHref}>BACK</Link>
        </Box>
      )}
      <Heading level={2}>{title}</Heading>
      {children}
    </Box>
  );
}
