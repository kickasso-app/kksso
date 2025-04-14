import { useState } from "react";
import { useRouter } from "next/router";
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

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;

    try {
      setLoading(true);
      const { error } = await updateUser({ password: new_password });

      // const { user, error } = await supabase.auth.updateUser({ password: new_password })

      // add in service/auth.js
      // updateUser: (data) => supabase.auth.resetPasswordForEmail(data),

      if (error) throw error;
      setEmailSent(true);
    } catch (error) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { vertical: "small" };

  return (
    <Row around="xs">
      <Col xs={12} md={8}>
        <form onSubmit={handleResetPassword}>
          <Box pad="medium">
            <Heading level={3} alignSelf="center">
              Reset Password
            </Heading>
            <Box>
              <FormField
                name="email"
                label="Email"
                margin={fieldMargin}
                required
              >
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email"
                />
              </FormField>
            </Box>
            <Box margin={fieldMargin}>
              <Button btnStyle="filled" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>
            {emailSent && (
              <Notification
                toast
                status="normal"
                title="Email Sent!"
                message="Please check your inbox to reset your password."
                onClose={() => setEmailSent(false)}
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
