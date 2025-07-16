import React, { useEffect } from "react";
import { useRouter } from "next/router";

import {
  Box,
  Heading,
  Text,
  FormField,
  Notification,
  Select,
  Button as GrommetButton,
} from "grommet";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { useAccount } from "services/account";
import { useAuth } from "services/auth";
import { useEvents } from "services/events";

import EventCardEdit from "../EventCardEdit";

const MAX_EVENTS = 3;
export default function EventsSettingsForm({ profile }) {
  const router = useRouter();

  const { session, user } = useAuth();

  const { updateAccount, isUpdateSuccess, isUpdateError } = useAccount();
  const { createEvent, fetchAccountEvents, events, loading, error } =
    useEvents();

  useEffect(() => {
    if (user?.role === "authenticated" && user.id) {
      fetchAccountEvents(user.id);
    }
  }, [session, user]);

  const studioEventId = profile?.eventId || "";

  const createNewEvent = async () => {
    const event_id = self.crypto.randomUUID();

    const newEvent = {
      event_id: event_id,
      studio_uuid: user.id,
      cityLocation: profile.location,
    };
    await createEvent(newEvent);
    if (events?.length === 0) {
      await updateAccount({ eventId: event_id }, user);
    }
    router.push("/profile/events/" + event_id);
  };

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box
        fill="horizontal"
        pad="medium"
        gap="medium"
        width={{ max: "large" }} // on larger screens, limit to "large"
      >
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Events
        </Heading>

        <Box margin={textMargin}>
          <Text>
            If you want to host a public event like an open studio, mini
            exhibition or workshop, you can add it here. You can create up to 3
            events.
            <br />
            Your events will be visible in our events page and your main event
            will be visible in your profile.
          </Text>
        </Box>

        <Row>
          <Col xs={12} md={12}>
            <Box
              align="start"
              margin={{ vertical: "medium", horizontal: "none" }}
            >
              {loading ? (
                <img src="/img/loader.svg" alt="Loading" />
              ) : error || !events.length ? (
                <Box align="center">
                  <Text>No events found.</Text>
                  <GrommetButton
                    primary
                    label="Create Event"
                    onClick={createNewEvent}
                    margin={{ top: "large" }}
                  />
                </Box>
              ) : (
                events.map((e) => (
                  <EventCardEdit
                    key={e.id}
                    event={e}
                    imgPath={user.id + "/" + e.id}
                    onEdit={() => {
                      router.push("/profile/events/" + e.id);
                    }}
                    onView={() => {
                      router.push("/event/" + e.id);
                    }}
                    onPreview={() => {
                      router.push("/event/preview/" + e.id);
                    }}
                  />
                ))
              )}
            </Box>
            <Box margin={{ top: "large" }}>
              <FormField
                label="Select Main Event"
                name="mainEvent"
                margin={fieldMargin}
              >
                <Text margin="small">
                  This is the event that is shown in your studio page
                </Text>
                <Select
                  name="mainEvent"
                  options={events
                    .filter((e) => e.isPublished)
                    .map((e) => ({ label: e.title, value: e.id }))}
                  labelKey="label"
                  valueKey={{ key: "value", reduce: true }}
                  placeholder={
                    events.find((e) => e.id === studioEventId)?.title ||
                    "Choose main event"
                  }
                  value={studioEventId}
                  onChange={({ value: mainEventId }) => {
                    updateAccount({ eventId: mainEventId }, user);
                  }}
                />
              </FormField>
            </Box>
            {events.length < MAX_EVENTS && (
              <GrommetButton
                primary
                label="Add New Event"
                onClick={createNewEvent}
                margin={{ vertical: "large" }}
              />
            )}
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
          </Col>
        </Row>
      </Box>
    </Box>
  );
}
