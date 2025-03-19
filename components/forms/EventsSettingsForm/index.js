import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  Box,
  // Grid,
  Heading,
  Text,
  Form,
  FormField,
  TextInput,
  Notification,
  TextArea,
  Select,
  Button as GrommetButton,
} from "grommet";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import EventsPhotoInput from "components/forms/EventsPhotoInput";
import { useAccount } from "services/account";
import { useAuth } from "services/auth";
import { useEvents } from "services/events";

import EventCardEdit from "../EventCardEdit";

import Button from "components/Button";
export default function EventsSettingsForm({ profile }) {
  const router = useRouter();

  const { session, user } = useAuth();

  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();
  const {
    createEvent,
    fetchEvents,
    events,
    loading: isEventsLoading,
    error,
  } = useEvents();

  useEffect(() => {
    if (user?.role === "authenticated" && user.id) {
      fetchEvents(user.id);
    }
  }, [session, user]);

  const createNewEvent = async () => {
    const event_id = self.crypto.randomUUID();

    const newEvent = {
      event_id: event_id,
      studio_uuid: user.id,
    };
    await createEvent(newEvent);
    await updateAccount({ eventId: event_id }, user);
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
            exhibition or workshop, you can add it here. Please fill out the
            details below and upload a photo for the event.
            <br /> Your event will be visible in your profile and on our events
            page.
          </Text>
        </Box>

        {/* <GrommetButton
          primary
          label="New Event"
          onClick={createNewEvent}
          margin={{ top: "large" }}
        /> */}

        <Row>
          <Col xs={12} md={12}>
            <Box
              align="start"
              margin={{ vertical: "medium", horizontal: "none" }}
            >
              {/* <Heading level={2} margin={{ vertical: "medium" }}>
                Events
              </Heading> */}
              {loading ? (
                <img src="/img/loader.svg" alt="Loading" />
              ) : error || !events.length ? (
                <Box align="center">
                  <Text>No events found.</Text>
                  <GrommetButton
                    primary
                    label="New Event"
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
                      router.push("/events/" + e.id);
                    }}
                  />
                ))
              )}
            </Box>
          </Col>
        </Row>
      </Box>
    </Box>
  );
}
