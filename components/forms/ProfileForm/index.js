import { useState } from "react";

import { useAccount } from "services/account";
import { useAuth } from "services/auth";

import Button from "components/Button";

// import { CheckCircle, XCircle } from "react-feather";
import {
  Box,
  Form,
  FormField,
  Notification,
  CheckBoxGroup,
  TextArea,
  TextInput,
  Text,
  Heading,
  Grommet,
  Anchor,
} from "grommet";

export default function ProfileForm({ profile, goToTab }) {
  const { user } = useAuth();

  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  const [values, setValues] = useState(profile);

  async function updateProfile(event) {
    const updates = {
      ...values,
      // updated_at: new Date(),
    };

    await updateAccount(updates, user);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Welcome to your Arti profile
        </Heading>
        <Text size="medium" margin={textMargin}>
          You can update your basic profile info below, add your photos and
          available visit dates and times. Then you can preview your profile and
          publish it in{" "}
          <Anchor onClick={() => goToTab(3)}>
            <b> Settings</b>
          </Anchor>
          .
        </Text>
        <Grommet>
          <Form
            value={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() => setValues(profile)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <FormField name="artist" label="Name" margin={fieldMargin} required>
              <TextInput name="artist" placeholder="" />
            </FormField>
            <FormField
              label="A short intro (max 300 chars)"
              name="textMini"
              margin={fieldMargin}
            >
              <TextArea
                name="textMini"
                placeholder="Tell us about your art practice. This is the main text. (required)"
                fill
                maxLength={300}
                rows={6}
                required
              />
            </FormField>

            <FormField
              name="styles"
              label="Mediums and styles"
              margin={fieldMargin}
            >
              <TextInput
                name="styles"
                placeholder="painting, prints, sound (comma sepearted)"
                required
              />
            </FormField>

            {/* CHANGED FOR PILOT */}
            {/* <FormField
              name="accountType"
              label="How would you use your account?"
              margin={fieldMargin}
            >
              <CheckBoxGroup
                name="accountType"
                valueKey="id"
                options={[
                  { label: "Artist", id: "Artist" },
                  { label: "Art Lover", id: "Art Lover" },
                  { label: "Collector", id: "Collector" },
                ]}
              />
            </FormField> */}

            <FormField
              label="About your Art"
              name="textLong"
              margin={fieldMargin}
            >
              <TextArea
                name="textLong"
                placeholder="Tell us about your artwork in more detail"
                fill
                maxLength={1200}
                rows={8}
              />
            </FormField>

            <FormField
              name="website"
              htmlfor="text-input-id"
              label="Website"
              type="url"
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="website"
                placeholder="https://yoursite.com"
              />
            </FormField>
            <FormField
              name="instagram"
              htmlfor="text-input-id"
              label="Instagram"
              type="url"
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="instagram"
                placeholder="https://instagram.com/X"
              />
            </FormField>

            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Update
              </Button>
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
          </Form>
        </Grommet>
      </Box>
    </Box>
  );
}

{
  /* <FormField
              name="from_name"
              htmlfor="text-input-id"
              label="Name"
              required
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="from_name"
                placeholder="Name"
              />
            </FormField>
            <FormField
              label="Email"
              name="requestor_email"
              required
              validate={{
                regexp: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              }}
              margin={fieldMargin}
            >
              <MaskedInput
                name="requestor_email"
                mask={[
                  { regexp: /^[\w\-_.]+$/, placeholder: "your" },
                  { fixed: "@" },
                  { regexp: /^[\w]+$/, placeholder: "email" },
                  { fixed: "." },
                  { regexp: /^[\w]+$/, placeholder: "com" },
                ]}
              />
            </FormField> */
}
