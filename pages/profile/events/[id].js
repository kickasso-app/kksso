import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import { ChevronLeft } from "react-feather";

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
  CheckBox,
  Button as GrommetButton,
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
  isWithoutRegistration: false,
  fee: "",
  currentNJoined: "",
  maxNJoined: "",
  miniDescription: "",
  longDescription: "",
  languages: "",
  contact: "",
  link: "",
  location: "Studio",
  locationOther: "",
  isPublished: false,
};

const EVENT_TYPES = [
  "Workshop",
  "Open Studio",
  "Exhibition",
  "Art Salon",
  "Studio Tour",
  "Artist Dinner",
  "Talk",
  "Film Screening",
  "Community",
  "Other",
];

// TODO: move this file and somewhere else and give it a better name

const EventEditForm = () => {
  const router = useRouter();
  const { id } = router.query;

  const { session, user } = useAuth();
  const { profile, fetchProfile } = useAccount();
  const {
    event,
    fetchEvent,
    updateEvent,
    loading,
    isUpdateSuccess,
    isUpdateError,
  } = useEvents();

  const [values, setValues] = useState(initialValues);
  const [isEventEdited, setIsEventEdited] = useState(false);

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
      isWithoutRegistration: values.isWithoutRegistration,
      currentNJoined: values.currentNJoined,
      maxNJoined: values.maxNJoined,
      fee: values.fee,
      miniDescription: values.miniDescription,
      longDescription: values.longDescription,
      languages: values.languages,
      contact: values.contact,
      link: values.link,
      isPublished: values.isPublished ? true : false,
    };
    await updateEvent(eventData, id);
  }
  // TODO:
  // if isStuidoEvent is true, then update the studio page with the event
  // remove the isMainEvent from the event object

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
        // console.log("fetching event", id);
        await fetchEvent({ event_id: id });
      }
      // console.log(event);
      if (user && id && event && event.id === id && !isEventEdited) {
        setValues({
          eventType: event.type ?? "Workshop",
          eventTypeOther:
            event.type === "Other" ? event.eventTypeOther ?? "" : "",
          eventTitle: event.title ?? "",
          eventDate: event.date ?? "",
          eventTime: event.time ?? "",
          isWithoutRegistration: event.isWithoutRegistration ?? false,
          currentNJoined: event.currentNJoined ?? "",
          maxNJoined: event.maxNJoined ?? "",
          miniDescription: event.miniDescription ?? "",
          longDescription: event.longDescription ?? "",
          languages: event.languages ?? "",
          fee: event.fee ?? "",
          contact: event.contact ?? "",
          link: event.link ?? "",
          isPublished: event.isPublished ?? false,
          location: event.location == "Studio" ? "Studio" : "Other",
          locationOther: event.location !== "Studio" ? event.location : "",
        });
      }
    }
    fetchData();
  }, [user, id, event]);

  return (
    <Box fill align="center" justify="center">
      <Box fill="horizontal" pad="medium" gap="medium" width={{ max: "large" }}>
        <br />
        <Box direction="col">
          <ChevronLeft size={16} />{" "}
          <Link href={"/profile?section=3"}>BACK</Link>
        </Box>
        <Heading level="3" size="medium" margin={fieldMargin}>
          {event?.title || "New Event"}
        </Heading>

        <Text>
          {" "}
          Please fill out the details below and upload a photo for the event.
        </Text>
        {event && (
          <Grid fluid>
            <Form
              value={values}
              onChange={(nextValue) => {
                setValues(nextValue);
                setIsEventEdited(true);
              }}
              onSubmit={handleUpdateEvent}
              validate="submit"
            >
              <FormField
                label="Event Title"
                name="eventTitle"
                margin={fieldMargin}
              >
                <TextInput
                  name="eventTitle"
                  placeholder="Enter event title"
                  required
                />
              </FormField>
              <FormField
                label="Event Type"
                name="eventType"
                margin={fieldMargin}
              >
                <Select
                  name="eventType"
                  options={EVENT_TYPES}
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
                  required
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
                    required
                  />
                </FormField>
              )}
              <Box margin={textMargin}>
                <Heading level="4" size="medium" margin={{ bottom: "small" }}>
                  Event Photo
                </Heading>
                <Text>
                  We suggest a square ratio (1:1) for this image. <br />
                  Please make sure that your image file are smaller than{" "}
                  <b>1 MB </b>
                </Text>
              </Box>
              <EventsPhotoInput
                event={event}
                userId={user.id}
                // postUpload={handlePostUpload}
              />
              <FormField
                label="Event Date"
                name="eventDate"
                margin={fieldMargin}
              >
                <TextInput name="eventDate" placeholder="YYYY-MM-DD" required />
              </FormField>
              <FormField
                label="Event Time"
                name="eventTime"
                margin={fieldMargin}
              >
                <TextInput
                  name="eventTime"
                  placeholder="e.g. 6-8 pm"
                  required
                />
              </FormField>
              <FormField
                label="Remove Event Registration Form"
                name="isWithoutRegistration"
                margin={fieldMargin}
              >
                <CheckBox
                  name="isWithoutRegistration"
                  checked={values.isWithoutRegistration}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      isWithoutRegistration: e.target.checked,
                    }))
                  }
                  label="Check this if your event is open and does not require registration"
                />
              </FormField>
              <FormField
                label="Participation Fee - per person (optional)"
                name="fee"
                margin={fieldMargin}
              >
                <TextInput name="fee" placeholder="e.g. 30 Euros" />
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
                  required
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
                    required
                  />
                </FormField>
              )}
              <FormField
                label="Languages"
                name="languages"
                margin={fieldMargin}
              >
                <TextInput name="languages" placeholder="English, Spainsh" />
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
                  required
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
                  required
                />
              </FormField>
              <FormField
                label="Maximum number of participants (optional)"
                name="maxNJoined"
                margin={fieldMargin}
              >
                <TextInput
                  name="maxNJoined"
                  placeholder="Enter a number 10 or leave it empty"
                />
              </FormField>
              {values?.maxNJoined && (
                <FormField
                  label="Current Number of Participants (optional)"
                  name="currentNJoined"
                  margin={fieldMargin}
                >
                  <Text size="small" margin="small">
                    Update this number when participants register for your event
                    and it will be shown in the event page
                  </Text>
                  <TextInput
                    name="currentNJoined"
                    placeholder="Optional: current number joined"
                    type="number"
                    max={values.maxNJoined}
                  />
                </FormField>
              )}
              <FormField
                label="Contact (optional)"
                name="contact"
                margin={fieldMargin}
              >
                <TextInput name="contact" placeholder="Enter contact details" />
              </FormField>
              <FormField
                label="Event Link (Optional)"
                name="link"
                margin={fieldMargin}
              >
                <TextInput
                  name="link"
                  placeholder="htttp://www.your-event-link.com"
                />
              </FormField>
              <FormField label="Status" name="isPublished" margin={fieldMargin}>
                <Select
                  name="isPublished"
                  options={["Published", "Not Published"]}
                  placeholder="Select"
                  value={values.isPublished ? "Published" : "Not Published"}
                  onChange={({ option }) =>
                    setValues((prev) => ({
                      ...prev,
                      isPublished: option === "Published",
                    }))
                  }
                  required
                />
              </FormField>
              <Box direction="row" gap="medium">
                <Button type="submit" btnStyle="filled" disabled={loading}>
                  Save Changes
                </Button>
              </Box>
              <Box direction="col" margin={{ top: "medium", bottom: "xlarge" }}>
                <ChevronLeft size={16} />{" "}
                <Link href={"/profile?section=3"}>BACK to preview</Link>
              </Box>
              {!loading && (
                <>
                  {isUpdateSuccess && (
                    <Notification
                      toast
                      status="normal"
                      title="Your event was updated."
                    />
                  )}
                  {isUpdateError && (
                    <Notification
                      toast
                      status="warning"
                      title="Your event was not updated!"
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
      {/* <GrommetButton
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
      /> */}
    </Box>
  );
};

export default EventEditForm;
