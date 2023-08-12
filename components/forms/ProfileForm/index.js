import { useState } from "react";
import { supabase } from "services/supabase";

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
} from "grommet";


export default function ProfileForm({ profile }) {
  const [values, setValues] = useState(profile);

  const [loading, setLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const { user } = useAuth();

  async function updateProfile(event) {
    //  console.log(event.touched);
    try {
      setIsUpdateError(false);
      setIsUpdateSuccess(false);
      setLoading(true);

      const updates = {
        ...values,
        // updated_at: new Date(),
      };

      let { error } = await supabase
        .from("studios")
        .update(updates, { returning: "minimal" })
        .eq("uuid", user.id);

      if (error) {
        setIsUpdateError(true);
        throw error;
      } else {
        setIsUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updatePhotosUrl(url) {
    try {
      setIsUpdateError(false);
      setIsUpdateSuccess(false);
      setLoading(true);

      let { error } = await supabase
        .from("studios")
        .update({ photoUrl: url }, { returning: "minimal" })
        .eq("uuid", user.id);

      if (error) {
        setIsUpdateError(true);
        throw error;
      } else {
        setIsUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Welcome
        </Heading>
        <Text size="medium" margin={textMargin}>
          Update your profile here
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

            <FormField name="city" label="City" margin={fieldMargin} required>
              <TextInput name="city" placeholder="Berlin" />
            </FormField>

            <FormField
              name="styles"
              label="Mediums and styles"
              margin={fieldMargin}
            >
              <TextInput name="styles" placeholder="painting, prints, sound" />
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
              label="About your Art"
              name="textLong"
              margin={fieldMargin}
            >
              <TextArea
                name="textLong"
                placeholder="Tell us about your artwork or collection in more detail"
                fill
                maxLength={1200}
                rows={8}
              />
            </FormField>

            <FormField
              label="About your Studio"
              name="textStudio"
              margin={fieldMargin}
            >
              <TextArea
                name="textStudio"
                placeholder="Tell us about your space or studio"
                fill
                maxLength={1200}
                rows={8}
              />
            </FormField>

            <FormField
              name="website"
              htmlfor="text-input-id"
              label="Website (optional)"
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
              label="Instagram (optional)"
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
