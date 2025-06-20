import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "services/auth";
import { sendMagicLink } from "services/magiclinks";

import { Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, FormField, TextInput, Heading, Text, Paragraph } from "grommet";
import { Checkmark } from "grommet-icons";
import { ChevronLeft } from "react-feather";

import Button from "components/Button";

export default function Magiclink() {
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  const handleMagicLink = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;

    try {
      setLoading(true);
      const { error } = await sendMagicLink({ email });
      if (error) {
        setMagicLinkSent(false);
        throw error;
      } else {
        setMagicLinkSent(true);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { vertical: "small" };

  return (
    <Row around="xs">
      <Col xs={12} md={8}>
        <ChevronLeft size={16} /> <Link href={"/join"}>BACK</Link>
        <form onSubmit={handleMagicLink}>
          <Box pad="medium">
            <Heading level={3} alignSelf="center" margin={fieldMargin}>
              Magic Link
            </Heading>
            <Paragraph fill margin={{ vertical: "medium" }}>
              We will send you a one-time link to login
            </Paragraph>
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
              <Button btnStyle="filled" type="submit">
                {loading ? "Loading..." : "Send"}
              </Button>
            </Box>
          </Box>
        </form>
        {magicLinkSent && (
          <Box margin="small" pad="medium">
            <Checkmark color="dark-3" />
            <br />
            <Paragraph fill>
              We sent a magic link to your email from <b>hello@arti.my</b>.
              Please check your inbox and spam folder to log in to your account.{" "}
            </Paragraph>
          </Box>
        )}
      </Col>
    </Row>
  );
}
