import { useState, useEffect } from "react";

import moment from "moment";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import {
  Box,
  Form,
  FormField,
  Notification,
  CheckBoxGroup,
  Calendar,
  TextArea,
  TextInput,
  Text,
  Heading,
} from "grommet";

import Button from "components/Button";

import { calendarBounds } from "config/calendar";

export default function EventsSettingsForm({
  profile: { events, eventsLink, eventsContact },
}) {
  const { user } = useAuth();
  const {
    updateAccount,
    calendarDate,
    updateCalendarDate,
    loading,
    isUpdateSuccess,
    isUpdateError,
  } = useAccount();

  const [values, setValues] = useState({
    events,
    eventsLink,
    eventsContact,
  });

  const readableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  // const disabledDates = [["2023-09-01", "2023-09-15"]];

  async function updateProfile(event) {
    const updates = {
      ...values,
    };

    await updateAccount(updates, user);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium" gap="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Events
        </Heading>

        <Grid fluid>
          <Form
            value={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() => setValues(profile)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <Box margin={textMargin}>
              <Text>
                If you want to host a public event like an open studio, mini
                exhibition or workshop, you can add it here. Please include the
                event's title, date and a short description using the following
                format: <br />
                <b> Event title / Event dates(s) / Event description </b>
              </Text>
            </Box>

            <FormField label="Your events" name="events" margin={fieldMargin}>
              <TextArea
                name="events"
                placeholder="e.g. Painting workshop / 20 May 6-8pm / It's workshop for beginners "
                fill
                maxLength={1200}
                rows={4}
              />
            </FormField>

            <FormField
              name="eventsLink"
              label="Link for the event (if available)"
              margin={fieldMargin}
            >
              <TextInput
                name="eventsLink"
                placeholder="e.g. https://www.studio-event-link.com"
              />
            </FormField>
            <br />
            <br />
            <Box margin={textMargin}>
              <Text>
                How can visitors or participants can contact you and RSVP for
                the event if needed?
              </Text>
            </Box>

            <FormField
              name="eventsContact"
              label="Contact channel for event"
              margin={fieldMargin}
            >
              <TextInput
                name="eventsContact"
                placeholder="e.g. your email or instagram link. This will be shown publicly on your profile."
              />
            </FormField>
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
        </Grid>
      </Box>
    </Box>
  );
}
