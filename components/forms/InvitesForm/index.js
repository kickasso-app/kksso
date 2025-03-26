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
  CheckBox,
  Button as GrommetButton,
} from "grommet";
import Button from "components/Button";

import { CollectorReferralTemplate } from "services/emails/collectorReferralTemplate";

const MAX_ARTIST_REFERRALS = 5;

export default function InvitesForm({ profile }) {
  const { user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  const [numOfArtistInvites, setNumOfArtistInvites] = useState(
    profile?.referrals?.length || 0
  );

  const [sendingInvite, setSendingInvite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewName, setPreviewName] = useState("");
  const [includeStudioLink, setIncludeStudioLink] = useState(true);

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  const addReferral = async (event, type) => {
    event.preventDefault();
    const toName = event.target.name.value;
    const toEmail = event.target.email.value;

    let newArtistInvites;
    let emailTemplate;
    let subject;
    let referralLink;
    let isContactCreated = false;

    if (type === "artist") {
      newArtistInvites = [
        ...(profile?.referrals || []),
        { name: toName, email: toEmail },
      ];
      emailTemplate = "referralTemplate";
      subject = "Arti Invite";
      referralLink = { joinLink: `https://arti.my/join?referral=${user.id}` };
    } else if (type === "artlover") {
      emailTemplate = "collectorReferralTemplate";
      subject = "Arti Invite";
      referralLink = { studioLink: `https://arti.my/studio/${user.id}` };
    }

    try {
      setSendingInvite(true);

      const emailDetails = {
        subject: subject,
        toEmail: toEmail,
        fromEmail: "default",
      };
      const emailVariables = {
        name: toName,
        referredBy: profile.artist,
        ...referralLink,
        includeStudioLink: type === "artlover" ? includeStudioLink : undefined,
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: emailTemplate,
        emailDetails,
        emailVariables,
      });

      if (emailSent === true) {
        let updateObj = {};
        if (type === "artist") {
          updateObj = { referrals: newArtistInvites };
          await updateAccount(updateObj, user);
          setNumOfArtistInvites(numOfArtistInvites + 1);
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

  const handleTogglePreview = (e) => {
    e.preventDefault();
    setPreviewName(e.target?.name?.value || "");
    setShowPreview(!showPreview);
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
          Invites
        </Heading>
        <Text size="medium" margin={textMargin}>
          Invite your favorite artists' studios or art lovers and collectors in
          your network to try it out.
        </Text>
        {/* Artist Referral Form */}
        <Heading level={3} margin={fieldMargin}>
          Invite an artist
        </Heading>
        {numOfArtistInvites < MAX_ARTIST_REFERRALS && (
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
              {sendingInvite ? "Sending ..." : "Send Artist Invite"}
            </Button>
          </form>
        )}
        <Text size="medium" margin={textMargin}>
          You sent {numOfArtistInvites} artist invites. You have{" "}
          {MAX_ARTIST_REFERRALS - numOfArtistInvites} left.
        </Text>
        <Box margin={{ vertical: "large" }}>
          <hr />
        </Box>
        <Heading level={3} margin={fieldMargin}>
          Invite art lovers and collectors
        </Heading>
        <Text size="medium"> </Text>
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
              <FormField name="includeStudioLink" margin={fieldMargin}>
                <CheckBox
                  name="includeStudioLink"
                  label="Include a link to my studio page"
                  checked={includeStudioLink}
                  onChange={(e) => setIncludeStudioLink(e.target.checked)}
                />
              </FormField>
            </Box>
          </Box>
          <br />
          {/* <Box direction="row" gap="medium" align="center"> */}
          <Button type="submit" btnStyle="filled">
            {sendingInvite ? "Sending ..." : "Send Invite"}
          </Button>
          <Button btnStyle="outline" onClick={handleTogglePreview}>
            <Text margin={{ horizontal: "small", vertical: "large" }}>
              Preview {showPreview && "[x]"}
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
              studioLink={`https://arti.my/studio/${user.id}`}
              includeStudioLink={includeStudioLink}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
