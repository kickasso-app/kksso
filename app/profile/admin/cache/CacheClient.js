'use client';

import { useState } from 'react';
import { Box, Button, Form, FormField, Heading, TextInput, Select } from 'grommet';

import AdminGate from 'components/AdminGate';
import useAdminFetch from 'hooks/useAdminFetch';

export default function CacheClient() {
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cacheValues, setCacheValues] = useState({ type: 'path', target: '' });

  const handleClearCache = async ({ value }) => {
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams();
      params.append(value.type, value.target);

      const { data } = await adminFetch(`/api/clear-cache?${params.toString()}`);
      setResult({ type: 'cache', data });
    } catch (error) {
      setResult({ type: 'error', error: error.message });
    }
    setLoading(false);
  };

  return (
    <AdminGate title="Clear Cache" backHref="/profile/admin">
      <Box pad="medium" border={{ color: 'brand' }} round="small" fill="horizontal">
        <Form
          value={cacheValues}
          onChange={setCacheValues}
          onSubmit={handleClearCache}
        >
          <FormField name="type" label="Type">
            <Select
              options={['path', 'tag']}
              name="type"
              value={cacheValues.type}
              onChange={({ option }) => setCacheValues({ ...cacheValues, type: option })}
            />
          </FormField>
          <FormField name="target" label="Path or Tag" required>
            <TextInput name="target" placeholder="/studios or studios" />
          </FormField>
          <Box direction="row" justify="start" margin={{ top: 'medium' }}>
            <Button type="submit" primary label="Revalidate" disabled={loading} />
          </Box>
        </Form>
      </Box>

      {result && (
        <Box pad="medium" background="light-2" round="small">
          <Heading level={4}>Result</Heading>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </AdminGate>
  );
}
