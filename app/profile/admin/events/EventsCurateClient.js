'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Button, Heading, ResponsiveContext, Select, Text } from 'grommet';
import { Edit2, Eye, Globe, Mail } from 'react-feather';

import AdminGate from 'components/AdminGate';
import AppButton from 'components/Button';
import { COUNTRIES } from 'config/constants/countries';
import { useAuth } from 'services/auth';

const ALL_COUNTRIES = 'All';

const formatDate = (date, format = 'D MMM YYYY') =>
  date ? moment(date).format(format) : 'No date';

const Meta = ({ children }) => (
  <Text size="small" color="text-weak" style={{ overflowWrap: 'anywhere' }}>
    {children}
  </Text>
);

// The link field is free text: a URL, a domain, or an Instagram @handle.
const toWebsiteUrl = (link = '') => {
  const value = link.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('@')) return `https://instagram.com/${value.slice(1)}`;
  if (/^[^\s/]+\.[^\s]+$/.test(value)) return `https://${value}`;
  return null;
};

const EventItem = ({ event, onApprove, approvingId }) => {
  const size = useContext(ResponsiveContext);
  const isSmall = size === 'small';
  const approving = approvingId === event.id;
  const websiteUrl = toWebsiteUrl(event.link);

  return (
    <Box
      direction={isSmall ? 'column' : 'row'}
      justify="between"
      align={isSmall ? 'start' : 'center'}
      gap="medium"
      pad="medium"
      border={{ color: 'brand' }}
      round="small"
    >
      <Box gap="small" flex>
        <Text>
          <b>{event.title || 'Untitled'}</b> by {event.host_name}
        </Text>
        <Meta>
          Event {formatDate(event.date)} · Submitted {formatDate(event.created_at)}
        </Meta>
        <Box direction="row" gap="small" margin={{ top: 'xsmall' }}>
          <Button
            plain
            icon={<Globe size={18} />}
            a11yTitle="Website"
            tip={event.link || 'No link'}
            disabled={!websiteUrl}
            href={websiteUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
          />
          <Button
            plain
            icon={<Mail size={18} />}
            a11yTitle="Email"
            tip={event.host_email}
            href={`mailto:${event.host_email}`}
          />
        </Box>
      </Box>

      <Box direction="row" gap="medium" align="center" flex={false}>
        <Button
          plain
          icon={<Eye size={22} />}
          a11yTitle="Preview"
          tip="Preview"
          href={`/event/preview/${event.id}`}
          target="_blank"
          rel="noopener noreferrer"
        />
        <Button
          plain
          icon={<Edit2 size={22} />}
          a11yTitle="Edit"
          tip="Edit"
          href={`/night/update?edittoken=${event.edittoken}`}
          target="_blank"
          rel="noopener noreferrer"

        />
        {event.isPublished ? (
          <Text size="small" weight="bold">Approved</Text>
        ) : (
          <AppButton btnStyle="filled" onClick={() => onApprove(event)} disabled={Boolean(approvingId)}>
            {approving ? 'Approving...' : 'Approve'}
          </AppButton>
        )}
      </Box>
    </Box>
  );
};

const Section = ({ title, subtitle, events, ...itemProps }) => (
  <Box gap="medium">
    <Box>
      <Heading level={3} margin="none">{title} ({events.length})</Heading>
      <Text size="small" color="text-weak">{subtitle}</Text>
    </Box>
    {events.length === 0 ? (
      <Text>Nothing here.</Text>
    ) : (
      events.map((event) => <EventItem key={event.id} event={event} {...itemProps} />)
    )}
  </Box>
);

export default function EventsCurateClient() {
  const { session } = useAuth();
  const accessToken = session?.access_token;

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [notice, setNotice] = useState(null);
  const [country, setCountry] = useState(ALL_COUNTRIES);

  const inCountry = (events) =>
    country === ALL_COUNTRIES ? events : events.filter((e) => e.country === country);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${accessToken}` }),
    [accessToken]
  );

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/admin/events', { headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load events');
      setPending(data.pending);
      setApproved(data.approved);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (accessToken) load();
  }, [accessToken, load]);

  const approve = async (event) => {
    setApprovingId(event.id);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: event.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to approve');
      setNotice(
        data.emailSent === false
          ? `"${event.title}" is approved, but the email to ${event.host_email} failed. Please let them know.`
          : `"${event.title}" is approved and ${event.host_name} was emailed.`
      );
      await load();
    } catch (err) {
      setNotice(`Could not approve "${event.title}": ${err.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <AdminGate title="Review Open Call - Arti Night" backHref="/profile/admin">
      <Box direction="row" align="center" gap="small">
        <Text weight="bold">Country</Text>
        <Box width="small">
          <Select
            a11yTitle="Filter by country"
            options={[ALL_COUNTRIES, ...COUNTRIES]}
            value={country}
            onChange={({ option }) => setCountry(option)}
          />
        </Box>
      </Box>
      {notice && (
        <Box pad="medium" background="light-2" round="small">
          <Text>{notice}</Text>
        </Box>
      )}
      {error && (
        <Box pad="medium" border={{ color: 'status-error' }} round="small">
          <Text>{error}</Text>
        </Box>
      )}
      {loading && !error && <Text>Loading...</Text>}
      {!loading && !error && (
        <Box gap="xlarge">
          <Section
            title="Waiting for approval"
            subtitle="Oldest submission first"
            events={inCountry(pending)}
            onApprove={approve}
            approvingId={approvingId}
          />
          <Section
            title="Approved"
            subtitle="Soonest event first"
            events={inCountry(approved)}
            onApprove={approve}
            approvingId={approvingId}
          />
        </Box>
      )}
    </AdminGate>
  );
}
