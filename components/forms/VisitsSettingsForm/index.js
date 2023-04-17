import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { useAuth } from "services/auth";

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
  address: "",
  visitRules: "",
  openDates: [],
};
export default function VisitsSettingsForm({ profile }) {
  const [values, setValues] = useState(emptyProfile);

  const [loading, setLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const { user, session } = useAuth();

  // TO DO: get address from separate table with more security
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

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium" gap="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Visit Settings
        </Heading>

        <Grommet>
          <Box>
            <Heading level="4" size="medium" margin={textMargin}>
              General Visit Tips
            </Heading>
            <ul>
              <li>Show up on time</li>
              <li>Ask before taking photos of the artist and artworks</li>
              <li>A gift is almost always a nice touch</li>
            </ul>
          </Box>
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
            <FormField
              label="Your Visit Rules"
              name="visitRules"
              margin={fieldMargin}
            >
              <TextArea
                name="visitRules"
                placeholder="What do you expect from visitors at your studio?"
                fill
                rows={6}
                maxLength={500}
              />
            </FormField>

            <FormField
              name="address"
              label="Address (required if your studio is open for visits)"
              margin={fieldMargin}
              required
            >
              <Text>
                <b>
                  {"  "} We will only share your address with visitors after you
                  agree to host them
                </b>
              </Text>
              <TextInput placeholder="" />
              <TextArea
                name="address"
                placeholder="Your address"
                fill
                rows={3}
                maxLength={200}
                disabled
              />
            </FormField>

            <Heading level={3}>To do: add visit dates</Heading>
            <br />
            <br />

            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Update
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
