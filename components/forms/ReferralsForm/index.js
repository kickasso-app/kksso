import { useState } from "react";
import { Box, Heading, Text, FormField, TextInput } from "grommet";
import Button from "components/Button";
import { sendEmail } from "services/sendEmail";

const MAX_REFERRALS = 5;

export default function ReferralsForm({ profile, user, updateAccount }) {
  const [numOfReferrals, setNumOfReferrals] = useState(
    profile?.referrals?.length || 0
  );
  const [sendingInvite, setSendingInvite] = useState(false);
  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

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
    const newReferrals = [
      ...(profile?.referrals || []),
      { name: toName, email: toEmail },
    ];

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
        await updateAccount({ referrals: newReferrals }, user);
        setNumOfReferrals(numOfReferrals + 1);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <Box fill align="center" justify="center">
      <Box
        fill="horizontal"
        pad="medium"
        gap="medium"
        width={{ max: "large" }} // on larger screens, limit to "large"
      >
        <Heading level="3" size="medium" margin={fieldMargin}>
          Referrals
        </Heading>
        <Text size="medium" margin={textMargin}>
          Invite your favorite artists' studios to join Arti
        </Text>
        {numOfReferrals < MAX_REFERRALS && (
          <form onSubmit={addReferral}>
            <Box width="medium">
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
              {sendingInvite ? "Sending ..." : "Send Referral"}
            </Button>
          </form>
        )}
        <br />
        <Text size="medium" margin={textMargin}>
          You sent {numOfReferrals} invites. You have{" "}
          {MAX_REFERRALS - numOfReferrals} left.
        </Text>
      </Box>
    </Box>
  );
}
