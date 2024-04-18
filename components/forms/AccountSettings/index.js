import { useState, useEffect } from "react";
import { supabase } from "services/supabase";
import Link from "next/link";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";

import Button from "components/Button";
import { Box, Text, Heading, Notification } from "grommet";

export default function AccountSettings({ profile }) {
  const [isPublished, setIsPublished] = useState(profile?.published);

  const router = useRouter();

  const { signOut, user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  // console.log(profile);

  async function togglePublishProfile() {
    const isPublishedNew = !isPublished;

    await updateAccount({ published: isPublishedNew }, user);
  }

  // TO DO: add delete function to BE
  const handleDeleteUser = async () => {
    try {
      // setLoading(true);
      const { error } = await signOut({});
      if (error) throw error;
      else {
        router.push("/");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      // setLoading(false);
    }
  };

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium" gap="xlarge">
        <Box width="medium">
          <Heading level="3" size="medium" margin={fieldMargin}>
            Publish Your Profile
          </Heading>

          {isPublished ? (
            <>
              <Text size="medium" margin={textMargin}>
                Your profile is now <b>published</b>{" "}
                <Link href={`/studio/${profile.studio_id}`}> here</Link>.
              </Text>
              <Text size="medium" margin={textMargin}>
                Do you want to unpublish it and save it as a draft for now?
              </Text>
              <Button onClick={togglePublishProfile} btnStyle="outline">
                Unpublish
              </Button>
            </>
          ) : (
            <>
              <Text size="medium" margin={textMargin}>
                Are you ready to publish you profile?
              </Text>
              <Text size="medium" margin={textMargin}>
                You can preview it <Link href={`/preview`}> here</Link>.
              </Text>
              <Text size="medium" margin={textMargin}></Text>
              <Button onClick={togglePublishProfile} btnStyle="outline">
                Publish
              </Button>
            </>
          )}
        </Box>

        <Box width="medium">
          <Heading level="3" size="medium" margin={fieldMargin}>
            Delete Account
          </Heading>
          <Text size="medium" margin={textMargin}>
            We are sad to see you leave.
          </Text>
          <Text size="medium" margin={textMargin}>
            Are you sure you want to delete your account?
          </Text>
          <Button onClick={handleDeleteUser} btnStyle="filled">
            Delete account
          </Button>
        </Box>
      </Box>
      {!loading && (
        <>
          {isUpdateSuccess && (
            <Notification
              toast
              status="normal"
              title="Your profile was updated."
            />
          )}
          {isUpdateError && (
            <Notification
              toast
              status="warning"
              title="Your profile was not updated!"
              message="We couldn't complete your request this time. Please try again."
              // onClose={() => {}}
            />
          )}
        </>
      )}
    </Box>
  );
}
