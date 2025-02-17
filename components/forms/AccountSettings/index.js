import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";
import { sendEmail } from "services/sendEmail";

import Button from "components/Button";
import {
  Box,
  Text,
  Heading,
  Notification,
  FormField,
  TextInput,
} from "grommet";
import { featureFlags } from "config/feature-flags";
// import { TestTemplate } from "services/emails/testTemplate";

const MAX_REFERRALS = 5;

export default function AccountSettings({ profile }) {
  const [isPublished, setIsPublished] = useState(profile?.published);
  const [numOfReferrals, setNumOfReferrals] = useState(
    profile?.referrals?.length || 0
  );
  const [sendingInvite, setSendingInvite] = useState(false);

  const router = useRouter();

  const { signOut, user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  // console.log(profile);

  async function togglePublishProfile() {
    const isPublishedNew = !isPublished;

    await updateAccount({ published: isPublishedNew }, user);
  }

  // const sendTestEmail = async (event) => {
  //   event.preventDefault();
  //   const emailDetails = {
  //     subject: "Arti Invite Test",
  //     toEmail: "demo",
  //     fromEmail: "default",
  //   };
  //   const emailVariables = {
  //     name: "New User Name",
  //     referredBy: profile.artist,
  //     joinLink: `https://arti.my/join?referral=${profile.uuid}`,
  //   };
  //   const { emailSent, error } = await sendEmail({
  //     emailTemplate: "referralTemplate",
  //     emailDetails,
  //     emailVariables,
  //   });
  //   console.log("email is sent =", emailSent);
  // };

  const addReferral = async (event) => {
    event.preventDefault();
    const toName = event.target.artistname.value;
    const toEmail = event.target.email.value;
    const newReferals = [
      ...(profile?.referrals || []),
      { name: toName, email: toEmail },
    ];
    // console.log(newReferals);

    try {
      setSendingInvite(true);

      const emailDetails = {
        subject: "Arti Invite",
        toEmail: [toEmail],
        fromEmail: "default",
      };
      const emailVariables = {
        name: toName,
        referredBy: profile.artist,
        joinLink: `https://arti.my/join?referral=${user.id}`,
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: "referralTemplate",
        emailDetails,
        emailVariables,
      });

      if (emailSent === true) {
        await updateAccount({ referrals: newReferals }, user);
        setNumOfReferrals(numOfReferrals + 1);

        setSendingInvite(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSendingInvite(false);
    }
  };

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
              <br />
              <Button onClick={togglePublishProfile} btnStyle="filled">
                Publish
              </Button>
            </>
          )}
        </Box>

        {featureFlags.referrals && (
          <Box width="medium">
            <Heading level="3" size="medium" margin={fieldMargin}>
              Referrals
            </Heading>
            <Text size="medium" margin={textMargin}>
              Invite your favorite artists' studios to join Arti
            </Text>
            {numOfReferrals < MAX_REFERRALS && (
              <form onSubmit={addReferral}>
                <Box width="medium">
                  {/* <TextInput value={value} onChange={onChange} aria-label="Artist Name" placeholder="Artist Name" /> */}
                  <Box>
                    <FormField
                      name="artistname"
                      label="Artist Name"
                      margin={fieldMargin}
                      required
                    >
                      <TextInput
                        id="artistname"
                        name="artistname"
                        placeholder="Name"
                      />
                    </FormField>
                  </Box>
                  <Box>
                    <FormField
                      name="email"
                      label="Artist Email"
                      margin={fieldMargin}
                      required
                    >
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Artist email"
                      />
                    </FormField>
                  </Box>
                </Box>

                <br />

                <Button type="submit" btnStyle="filled">
                  {sendingInvite ? "Sending ... " : "Send Referral"}
                </Button>
              </form>
            )}
            <br />

            <Text size="medium" margin={textMargin}>
              You sent {numOfReferrals} invites. You have{" "}
              {MAX_REFERRALS - numOfReferrals} left.
            </Text>
          </Box>
        )}

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
          <Button onClick={handleDeleteUser} btnStyle="outline">
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
      {/* <br />
      <br />
      <Button onClick={sendTestEmail} btnStyle="outline">
        test EMail Resend
      </Button> */}
    </Box>
  );
}
