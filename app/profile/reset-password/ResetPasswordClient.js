'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "services/auth";

import { Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import {
  Box,
  FormField,
  TextInput,
  Heading,
  Text,
  Notification,
} from "grommet";
import Button from "components/Button";

export default function ResetPasswordClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { updateUser } = useAuth();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const newPassword = event.target.password.value;

    try {
      setLoading(true);
      setError(null);
      const { error } = await updateUser({ password: newPassword });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
          router.push('/profile');
      }, 3000);
    } catch (error) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };

  return (
    <Row around="xs">
      <Col xs={12} md={8}>
        <form onSubmit={handleResetPassword}>
          <Box pad="medium">
            <Heading level={3} alignSelf="center">
              Set New Password
            </Heading>
            <Box>
              <FormField
                name="password"
                label="New Password"
                margin={fieldMargin}
                required
              >
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                />
              </FormField>
            </Box>
            <Box margin={fieldMargin}>
              <Button btnStyle="filled" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Box>
            {success && (
              <Notification
                toast
                status="normal"
                title="Success!"
                message="Your password has been updated. Redirecting to profile..."
                onClose={() => setSuccess(false)}
              />
            )}
            {error && (
              <Notification
                toast
                status="critical"
                title="Error"
                message={error}
                onClose={() => setError(null)}
              />
            )}
          </Box>
        </form>
      </Col>
    </Row>
  );
}
