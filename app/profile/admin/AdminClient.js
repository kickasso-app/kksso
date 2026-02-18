'use client';

import { useState } from 'react';
import { useAuth } from 'services/auth';
import { Box, Button, Form, FormField, Heading, TextInput, TextArea, Select, Text, Anchor } from 'grommet';

export default function AdminClient() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Cache State
  const [cacheValues, setCacheValues] = useState({ token: '', type: 'path', target: '' });

  // Email State
  const [emailValues, setEmailValues] = useState({ email: '', subject: '', markdown: '' });

  // If user is not admin, show access denied
  if (!user || user?.user_metadata?.role !== 'manager') {
    return (
      <Box pad="large" align="center">
        <Heading level={3}>Access Denied</Heading>
        <Text>You must be a manager to view this page.</Text>
        <Text size="small" color="status-disabled">Current role: {user?.user_metadata?.role || 'none'}</Text>
      </Box>
    );
  }

  const handleClearCache = async ({ value }) => {
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams();
      params.append('token', value.token);
      params.append(value.type, value.target);
      
      const res = await fetch(`/api/clear-cache?${params.toString()}`);
      const data = await res.json();
      setResult({ type: 'cache', data });
    } catch (error) {
      setResult({ type: 'error', error: error.message });
    }
    setLoading(false);
  };

  const handleSendEmail = async ({ value }) => {
    setLoading(true);
    setResult(null);
    let recipientEmail = value.email;
    
    // Try to parse if it looks like a JSON array
    if (typeof value.email === 'string' && value.email.trim().startsWith('[') && value.email.trim().endsWith(']')) {
      try {
        recipientEmail = JSON.parse(value.email);
      } catch (e) {
        console.error("Failed to parse email list", e);
      }
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailTemplate: 'genericTemplate',
          recipient: {
            type: 'user',
            email: recipientEmail
          },
          emailDetails: {
            subject: value.subject,
            fromEmail: 'default'
          },
          emailVariables: {
            markdown: value.markdown
          }
        })
      });
      const data = await res.json();
      setResult({ type: 'email', data });
    } catch (error) {
      setResult({ type: 'error', error: error.message });
    }
    setLoading(false);
  };

  return (
    <Box pad="large" gap="large">
      <Heading level={2}>Admin Dashboard</Heading>

      <Box direction="column" gap="large">
        {/* Clear Cache Section */}
        <Box pad="medium" border={{ color: 'brand' }} round="small" fill="horizontal">
          <Heading level={3}>Clear Cache</Heading>
          <br />
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
            <FormField name="token" label="Secret Token" required>
              <TextInput name="token" type="password" />
            </FormField>
            <Box direction="row" justify="start" margin={{ top: 'medium' }}>
              <Button type="submit" primary label="Revalidate" disabled={loading} />
            </Box>
          </Form>
        </Box>

        {/* Send Email Section */}
        <Box pad="medium" border={{ color: 'brand' }} round="small" fill="horizontal">
          <Heading level={3}>Send Generic Email</Heading>
          <br />
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
      </Box>

      {/* Results Display */}
      {result && (
        <Box pad="medium" background="light-2" round="small">
          <Heading level={4}>Result</Heading>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
