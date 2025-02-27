import { useState } from "react";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";

// import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import {
  Box,
  Form,
  FormField,
  Notification,
  TextArea,
  TextInput,
  Text,
  Heading,
} from "grommet";

import Button from "components/Button";

export default function StudioSettingsForm({
  profile: { visitRules, textStudio, location, district },
}) {
  const { user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  const [values, setValues] = useState({
    visitRules,
    location: location.join(","),
    district,
    textStudio,
  });

  async function updateProfile(event) {
    const updates = {
      ...values,
      location: values.location.split(","),
    };

    await updateAccount(updates, user);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Form
      value={values}
      onChange={(nextValue) => {
        setValues(nextValue);
      }}
      onReset={() => setValues(profile)}
      onSubmit={updateProfile}
      validate="submit"
    >
      <FormField
        name="location"
        label="Your studio location: City, Country"
        margin={textMargin}
        required
      >
        <TextInput name="location" placeholder="Berlin, Germany" />
      </FormField>

      <FormField
        name="district"
        label="District or Kiez in your city"
        margin={textMargin}
        required
      >
        <TextInput name="district" placeholder="Kreuzberg" />
      </FormField>

      <FormField
        label="About your Studio"
        name="textStudio"
        margin={fieldMargin}
      >
        <TextArea
          name="textStudio"
          placeholder="Tell us a bit about your studio.
Describe the role it plays in your process, how it affects your practice, and about the relationship(s) you have with it."
          fill
          maxLength={1200}
          rows={8}
        />
      </FormField>

      <Box>
        <Heading level="4" size="medium" margin={textMargin}>
          General visit tips
        </Heading>
        <ul>
          <li>Visits are free</li>
          <li>Show up on time</li>
          <li>Ask before taking photos of the artist and artworks</li>
          <li>A gift is almost always a nice touch</li>
        </ul>
      </Box>

      <FormField
        label="Your visit rules"
        name="visitRules"
        margin={fieldMargin}
      >
        <TextArea
          name="visitRules"
          placeholder="What do you expect from visitors at your studio?
ex: Rule 1; Rule 2; Rule 3 (semi-colon seperated)"
          fill
          rows={4}
          maxLength={500}
        />
      </FormField>
      <Text margin={textMargin}>
        {" "}
        ex: Rule 1; Rule 2; Rule 3 (semi-colon seperated){" "}
      </Text>
      <br />

      <br />
      <br />
      <Box direction="row" gap="medium">
        <Button type="submit" btnStyle="filled" disabled={loading}>
          Save Changes
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
  );
}
