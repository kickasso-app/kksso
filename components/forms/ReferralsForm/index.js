import { useState } from "react";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";
import { sendEmail } from "services/sendEmail";
import { createContact } from "services/contacts";

import {
  Box,
  Heading,
  Text,
  FormField,
  TextInput,
  Button as GrommetButton,
} from "grommet";
import Button from "components/Button";

import { CollectorReferralTemplate } from "services/emails/collectorReferralTemplate";

const MAX_ARTIST_REFERRALS = 5;

export default function ReferralsForm({ profile }) {
  const { user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  const [numOfArtistReferrals, setNumOfArtistReferrals] = useState(
    profile?.referrals?.length || 0
  );

  const [sendingInvite, setSendingInvite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewName, setPreviewName] = useState("");

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  const addReferral = async (event, type) => {
    event.preventDefault();
    const toName = event.target.name.value;
    const toEmail = event.target.email.value;

    let newArtistReferrals;
    let emailTemplate;
    let subject;
    let referredBy;
    let referralLink;
    let isContactCreated = false;

    if (type === "artist") {
      newArtistReferrals = [
        ...(profile?.referrals || []),
        { name: toName, email: toEmail },
      ];
      emailTemplate = "referralTemplate";
      subject = "Arti Invite";
      referredBy = profile.artist;
      referralLink = `https://arti.my/join?referral=${user.id}`;
    } else if (type === "artlover") {
      emailTemplate = "collectorReferralTemplate";
      subject = "Arti Invite";
      referredBy = profile.artist;
      referralLink = `https://arti.my/studio/${user.id}`;
    }

    try {
      setSendingInvite(true);

      const emailDetails = {
        subject: subject,
        toEmail: "demo", // [toEmail],
        fromEmail: "default",
      };
      const emailVariables = {
        name: toName,
        referredBy: referredBy,
        studioName: profile.artist,
        joinLink: referralLink,
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: emailTemplate,
        emailDetails,
        emailVariables,
      });

      if (emailSent === true) {
        let updateObj = {};
        if (type === "artist") {
          updateObj = { referrals: newArtistReferrals };
          await updateAccount(updateObj, user);
          setNumOfArtistReferrals(numOfArtistReferrals + 1);
        } else if (type === "artlover") {
          isContactCreated = await createContact({
            newReferral: {
              name: toName,
              email: toEmail,
              referredBy: profile.artist,
            },
          });
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setSendingInvite(false);
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewName(e.target.name.value);
    setShowPreview(true);
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
          Invite your favorite artists' studios or art lovers and collectors in
          your network to try it out.
        </Text>
        {/* Artist Referral Form */}
        <Heading level={4} size="small" margin={fieldMargin}>
          Invite an artist
        </Heading>
        {numOfArtistReferrals < MAX_ARTIST_REFERRALS && (
          <form onSubmit={(e) => addReferral(e, "artist")}>
            <Box width="medium">
              <Box>
                <FormField
                  name="name"
                  label="Artist Name"
                  margin={fieldMargin}
                  required
                >
                  <TextInput id="artistname" name="name" placeholder="Name" />
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
              {sendingInvite ? "Sending ..." : "Send Artist Referral"}
            </Button>
          </form>
        )}
        <Text size="medium" margin={textMargin}>
          You sent {numOfArtistReferrals} artist invites. You have{" "}
          {MAX_ARTIST_REFERRALS - numOfArtistReferrals} left.
        </Text>
        <Box margin={{ vertical: "large" }}>
          <hr />
        </Box>
        <Heading level={4} size="small" margin={fieldMargin}>
          Invite art lovers and collectors
        </Heading>
        <form onSubmit={(e) => addReferral(e, "artlover")}>
          <Box width="medium">
            <Box>
              <FormField name="name" label="Name" margin={fieldMargin} required>
                <TextInput
                  id="collectorname"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => setPreviewName(e.target.value)}
                />
              </FormField>
            </Box>
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
                  placeholder="Email"
                />
              </FormField>
            </Box>
          </Box>
          <br />
          {/* <Box direction="row" gap="medium" align="center"> */}}
          <Button type="submit" btnStyle="filled">
            {sendingInvite ? "Sending ..." : "Send Invite"}
          </Button>
          <Button btnStyle="outline" onClick={handlePreview}>
            <Text margin={{ horizontal: "medium", vertical: "large" }}>
              Preview
            </Text>
          </Button>
          {/* </Box> */}
        </form>
        {/* Collector Referral Preview */}
        {showPreview && (
          <Box
            border={{ color: "brand", size: "xsmall" }}
            margin={{ top: "medium" }}
            pad="large"
          >
            <Heading level={4} size="small" margin={{ bottom: "small" }}>
              Email Preview
            </Heading>
            <CollectorReferralTemplate
              name={previewName || ""}
              referredBy={profile.artist}
              studioName={profile.artist}
              joinLink={`https://arti.my/studio/${user.id}`}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
