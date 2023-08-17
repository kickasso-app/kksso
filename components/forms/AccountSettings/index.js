import { useState, useEffect } from "react";
import { supabase } from "services/supabase";
import Link from "next/link";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";
import { useStudios } from "services/studios";

import Button from "components/Button";
import { Box, Text, Heading, Notification } from "grommet";

export default function AccountSettings({ profile }) {
  const [isPublished, setIsPublished] = useState(profile?.published);
  const [loading, setLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const router = useRouter();

  const { signOut, user } = useAuth();

  // console.log(profile);

  const { fetchStudios } = useStudios();

  async function togglePublishProfile() {
    const isPublishedNew = !isPublished;
    try {
      setIsUpdateError(false);
      setIsUpdateSuccess(false);
      setLoading(true);

      let { error } = await supabase
        .from("studios")
        .update({ published: isPublishedNew }, { returning: "minimal" })
        .eq("uuid", user.id);

      if (error) {
        setIsUpdateError(true);
        throw error;
      } else {
        await fetchStudios();
        setIsUpdateSuccess(true);
        setIsPublished(isPublishedNew);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  // TO DO: add delete function to BE
  const handleDeleteUser = async () => {
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
      {isUpdateSuccess && (
        <Notification
          toast
          status="normal"
          title="Your profile is now updated."
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

    </Box>
  );
}
