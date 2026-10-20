'use client';

import { useState } from 'react';
import { Box, Button, Form, FormField, Heading, TextInput, TextArea, Anchor } from 'grommet';

import AdminGate from 'components/AdminGate';
import useAdminFetch from 'hooks/useAdminFetch';

export default function EmailClient() {
  const adminFetch = useAdminFetch();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailValues, setEmailValues] = useState({ email: '', subject: '', markdown: '' });

  const handleSendEmail = async ({ value }) => {
    setLoading(true);
    setResult(null);
    let recipients = value.email;

    // Try to parse if it looks like a JSON array
    if (typeof value.email === 'string' && value.email.trim().startsWith('[') && value.email.trim().endsWith(']')) {
      try {
        recipients = JSON.parse(value.email);
      } catch (e) {
        console.error("Failed to parse email list", e);
      }
    }

    try {
      const { data } = await adminFetch('/api/admin/email', {
        method: 'POST',
        body: { recipients, subject: value.subject, markdown: value.markdown },
      });
      setResult({ type: 'email', data });
    } catch (error) {
      setResult({ type: 'error', error: error.message });
    }
    setLoading(false);
  };

  return (
    <AdminGate title="Send Generic Email" backHref="/profile/admin">
      <Box pad="medium" border={{ color: 'brand' }} round="small" fill="horizontal">
        <Form
          value={emailValues}
          onChange={setEmailValues}
          onSubmit={handleSendEmail}
        >
          <FormField name="email" label="Recipient Email(s)" required>
            <TextArea name="email" placeholder='example@mail.com OR ["mail1@test.com", "mail2@test.com"]' rows={2} />
          </FormField>
          <FormField name="subject" label="Subject" required>
            <TextInput name="subject" />
          </FormField>
          <FormField name="markdown" label="Body (Markdown)" required>
            <TextArea name="markdown" placeholder="# Hello&#10;This is **markdown** with [link](https://arti.my)" rows={8} />
          </FormField>
          <Box margin={{ bottom: 'medium' }}>
            <Anchor
              href="https://www.markdownguide.org/cheat-sheet/"
              target="_blank"
              label="View Markdown Guide & Cheat Sheet"
              size="small"
              style={{ textDecoration: 'underline' }}
            />
          </Box>
          <Box direction="row" justify="start" margin={{ top: 'medium' }}>
            <Button type="submit" primary label="Send" disabled={loading} />
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
