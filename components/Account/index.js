import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";

import Button from "components/Button";

import { Box, Text, Heading } from "grommet";

export default function Account() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signOut, user, session, authLoading } = useAuth();

  useEffect(() => {
    // getProfile();
  }, [session]);

  const handleSignOut = async () => {
    // event.preventDefault();

    try {
      setLoading(true);
      const { error } = await signOut({});
      if (error) throw error;
      else {
        router.push("/");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Hi
        </Heading>
        <Text size="medium" margin={textMargin}>
          Update your profile here
        </Text>
        <Button onClick={handleSignOut} btnStyle="outline">
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}
