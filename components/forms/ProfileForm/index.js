import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { useAuth } from "services/auth";

import Avatar from "components/Account/Avatar";
import Button from "components/Button";

import { CheckCircle, XCircle } from "react-feather";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  CheckBoxGroup,
  TextArea,
  TextInput,
  Text,
  Heading,
  Grommet,
} from "grommet";

const emptyProfile = {
  artist: "",
  city: "",
  styles: "",
  accountType: [],
  textMini: "",
};
export default function ProfileForm({ profile, profileLoading }) {
  const [values, setValues] = useState(emptyProfile);

  const [loading, setLoading] = useState(profileLoading);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const { user, session } = useAuth();

  useEffect(() => {
    if (profile?.artist) {
      setLoading(true);
      setValues(profile);
      setLoading(false);
    }
  }, [profile]);

  async function updateProfile(event) {
    console.log(event.touched);
    // console.log("Submit", event.value, event.touched);
    // console.log(values);
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
        .update(updates, {
          returning: "minimal", // Don't return the value after inserting
        })
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

  const fieldMargin = { vertical: "medium" };
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
              //   console.log("Change", nextValue);
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

            <FormField
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
            </FormField>

            <FormField
              label="A mini description"
              name="textMini"
              margin={fieldMargin}
            >
              <TextArea
                name="textMini"
                placeholder="Tell us about your artwork or collection, and your space or studio (required)"
                fill
                required
              />
            </FormField>

            {/* <FormField
              name="portfolio"
              htmlfor="text-input-id"
              label="Portfolio"
              type="url"
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="portfolio"
                placeholder="Link (optional)"
              />
            </FormField> */}
            <br />
            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Update
              </Button>

              <Button type="reset" btnStyle="outline">
                Clear
              </Button>
            </Box>

            {!loading && (
              <>
                {isUpdateSuccess && (
                  <Text>
                    <CheckCircle size={24} color="#C0FFF4" strokeWidth={3} />
                    <br />
                    Thanks for updating your profile!
                  </Text>
                )}
                {isUpdateError && (
                  <Text>
                    <XCircle size={24} color="#FFC0CB" strokeWidth={3} />
                    <br />
                    We couldn't send your request this time.
                    <br />
                    Please try again.
                  </Text>
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
