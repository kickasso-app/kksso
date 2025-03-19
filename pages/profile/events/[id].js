import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  Box,
  Grid,
  Heading,
  Text,
  Form,
  FormField,
  TextInput,
  Notification,
  TextArea,
  Select,
  Button as GrommetButton,
  generate,
} from "grommet";

import EventsPhotoInput from "components/forms/EventsPhotoInput";
import { useAccount } from "services/account";
import { useAuth } from "services/auth";
import { useEvents } from "services/events";

import Button from "components/Button";

const initialValues = {
  eventType: "Workshop",
  eventTypeOther: "",
  eventTitle: "",
  eventDate: "",
  eventTime: "",
  currentNJoined: "",
  maxNJoined: "",
  miniDescription: "",
  longDescription: "",
  contact: "",
  link: "",
  location: "Studio",
  locationOther: "",
};

const EventEditForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const { session, user } = useAuth();
  const {
    profile,
    fetchProfile,
    isUpdateSuccess,
    isUpdateError,
    loading,
    error,
  } = useAccount();

  const { event, fetchEvent, updateEvent } = useEvents();

  const [values, setValues] = useState(initialValues);

  async function handleUpdateEvent(event) {
    event.preventDefault();
    // Map form state values to the event structure expected by the backend

    const eventData = {
      type: values.eventType,
      // Only include eventTypeOther if type is Other
      ...(values.eventType === "Other" && { type: values.eventTypeOther }),

      location: values.location,
      ...(values.location === "Other" && {
        location: values.locationOther,
      }),
      title: values.eventTitle,
      date: values.eventDate,
      time: values.eventTime,
      currentNJoined: values.currentNJoined,
      maxNJoined: values.maxNJoined,
      miniDescription: values.miniDescription,
      longDescription: values.longDescription,
      contact: values.contact,
      link: values.link,
    };
    await updateEvent(eventData, id);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  useEffect(async () => {
    if (user?.role === "authenticated" && !profile) {
      await fetchProfile(user);
    }
  }, [session, profile]);

  useEffect(() => {
    async function fetchData() {
      if (user && id && (!event || event?.id !== id)) {
        console.log("fetching event", id);
        await fetchEvent({ event_id: id, studio_uuid: user.id });
      }
      if (user && id && event && event.id === id) {
        setValues({
          eventType: event.type ?? "Workshop",
          eventTypeOther:
            event.type === "Other" ? event.eventTypeOther ?? "" : "",
          eventTitle: event.title ?? "",
          eventDate: event.date ?? "",
          eventTime: event.time ?? "",
          currentNJoined: event.currentNJoined ?? "",
          maxNJoined: event.maxNJoined ?? "",
          miniDescription: event.miniDescription ?? "",
          longDescription: event.longDescription ?? "",
          contact: event.contact ?? "",
          link: event.link ?? "",
          location: event.location ?? "Studio",
          locationOther:
            event.location === "Other" ? event.locationOther ?? "" : "",
        });
      }
    }
    fetchData();
  }, [user, id, event]);

  return (
    <Box fill align="center" justify="center">
      <Box
        fill="horizontal"
        pad="medium"
        gap="medium"
        width={{ max: "large" }} // on larger screens, limit to "large"
      >
        <Heading level="3" size="medium" margin={fieldMargin}>
          {event?.title || "New Event"}
        </Heading>

        {event && (
          <Grid fluid>
            <Form
              value={values}
              onChange={(nextValue) => setValues(nextValue)}
              onSubmit={handleUpdateEvent}
              validate="submit"
            >
              <FormField
                label="Event Type"
                name="eventType"
                margin={fieldMargin}
              >
                <Select
                  name="eventType"
                  options={["Workshop", "Open Studio", "Exhibition", "Other"]}
                  value={values.eventType}
                  placeholder="Select event type"
                  onChange={({ option }) =>
                    setValues((prev) => ({
                      ...prev,
                      eventType: option,
                      // Clear the extra field if not "Other"
                      eventTypeOther:
                        option !== "Other" ? "" : prev.eventTypeOther,
                    }))
                  }
                />
              </FormField>

              {values.eventType === "Other" && (
                <FormField
                  label="Specify Event Type"
                  name="eventTypeOther"
                  margin={fieldMargin}
                >
                  <TextInput
                    name="eventTypeOther"
                    placeholder="Enter event type"
                    value={values.eventTypeOther}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        eventTypeOther: e.target.value,
                      }))
                    }
                  />
                </FormField>
              )}

              <EventsPhotoInput
                event={event}
                userId={user.id}
                // postUpload={handlePostUpload}
              />

              <FormField
                label="Event Title"
                name="eventTitle"
                margin={fieldMargin}
              >
                <TextInput name="eventTitle" placeholder="Enter event title" />
              </FormField>

              <FormField
                label="Event Date"
                name="eventDate"
                margin={fieldMargin}
              >
                <TextInput name="eventDate" placeholder="YYYY-MM-DD" />
              </FormField>

              <FormField label="Location" name="location" margin={fieldMargin}>
                <Select
                  name="location"
                  options={["Studio", "Other"]}
                  value={values.location || "Studio"}
                  onChange={({ option }) =>
                    setValues((prev) => ({
                      ...prev,
                      location: option,
                      locationOther:
                        option === "Other" ? prev.locationOther : "",
                    }))
                  }
                />
              </FormField>

              {values.location === "Other" && (
                <FormField
                  label="Specify Location"
                  name="locationOther"
                  margin={fieldMargin}
                >
                  <TextInput
                    name="locationOther"
                    placeholder="Enter location"
                    value={values.locationOther}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        locationOther: e.target.value,
                      }))
                    }
                  />
                </FormField>
              )}

              <FormField
                label="Event Time"
                name="eventTime"
                margin={fieldMargin}
              >
                <TextInput name="eventTime" placeholder="e.g. 6-8 pm" />
              </FormField>

              <FormField
                label="Current Number Joined"
                name="currentNJoined"
                margin={fieldMargin}
              >
                <TextInput
                  name="currentNJoined"
                  placeholder="Optional: current number joined"
                  type="number"
                />
              </FormField>

              <FormField
                label="Maximum Number Joined"
                name="maxNJoined"
                margin={fieldMargin}
              >
                <TextInput
                  name="maxNJoined"
                  placeholder="Optional: max number joined"
                  type="number"
                />
              </FormField>

              <FormField
                label="Short Description"
                name="miniDescription"
                margin={fieldMargin}
              >
                <TextArea
                  name="miniDescription"
                  placeholder="A brief event description"
                  maxLength={300}
                  rows={4}
                />
              </FormField>

              <FormField
                label="Long Description"
                name="longDescription"
                margin={fieldMargin}
              >
                <TextArea
                  name="longDescription"
                  placeholder="Detailed event description to show in the event's page"
                  maxLength={1000}
                  rows={8}
                />
              </FormField>

              <FormField label="Contact" name="contact" margin={fieldMargin}>
                <TextInput name="contact" placeholder="Enter contact details" />
              </FormField>

              <FormField label="Event Link" name="link" margin={fieldMargin}>
                <TextInput name="link" placeholder="Optional: event link" />
              </FormField>
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
        )}
      </Box>
      <GrommetButton
        primary
        label="Populate Demo Data"
        onClick={() =>
          setValues({
            eventType: "Workshop",
            eventTypeOther: "",
            eventTitle: "Demo Event Title",
            eventDate: "2023-12-25",
            eventTime: "10:00 AM - 12:00 PM",
            currentNJoined: "10",
            maxNJoined: "50",
            miniDescription: "A short demo description of the event.",
            longDescription:
              "This is a detailed description of the demo event, providing information about the schedule, speakers, and highlights.",
            contact: "demo@example.com",
            link: "https://example.com/event",
          })
        }
        margin={{ top: "large" }}
      />
    </Box>
  );
};

export default EventEditForm;
