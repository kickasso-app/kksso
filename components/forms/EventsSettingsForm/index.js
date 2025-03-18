import React, { useState } from "react";
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
} from "grommet";

import EventsPhotoInput from "components/forms/EventsPhotoInput";
import { useAccount } from "services/account";
import { useAuth } from "services/auth";

import Button from "components/Button";
export default function EventsSettingsForm({ profile }) {
  const { user } = useAuth();

  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();
  const initialEvent = profile.event || {};

  console.log(profile);

  const [values, setValues] = useState({
    eventType: initialEvent.type || "Workshop",
    eventTypeOther:
      initialEvent.type === "Other" ? initialEvent.eventTypeOther || "" : "",
    eventTitle: initialEvent.title || "",
    eventDate: initialEvent.date || "",
    eventTime: initialEvent.time || "",
    currentNJoined: initialEvent.currentNJoined || "",
    maxNJoined: initialEvent.maxNJoined || "",
    miniDescription: initialEvent.miniDescription || "",
    longDescription: initialEvent.longDescription || "",
    contact: initialEvent.contact || "",
    link: initialEvent.link || "",

    location: initialEvent.location || "Studio",
    locationOther:
      initialEvent.location === "Other" ? initialEvent.locationOther || "" : "",
  });

  async function updateProfile(event) {
    event.preventDefault();
    // Map form state values to the event structure expected by the backend
    const eventData = {
      type: values.eventType,
      // Only include eventTypeOther if type is Other
      ...(values.eventType === "Other" && { typeOther: values.eventTypeOther }),
      title: values.eventTitle,
      date: values.eventDate,
      time: values.eventTime,
      location: values.location,
      ...(values.location === "Other" && {
        locationOther: values.locationOther,
      }),
      currentNJoined: values.currentNJoined,
      maxNJoined: values.maxNJoined,
      miniDescription: values.miniDescription,
      longDescription: values.longDescription,
      contact: values.contact,
      link: values.link,
    };
    await updateAccount({ event: eventData }, user);
  }

  // Handler to refresh after image upload
  const handlePostUpload = async (newPhotoPath, newPhotoId) => {
    // nothing to do here
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
          Your Event
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

        <Grid fluid>
          <Form
            value={values}
            onChange={(nextValue) => setValues(nextValue)}
            onReset={() => setValues(initialEvent)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <FormField label="Event Type" name="eventType" margin={fieldMargin}>
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

            <EventsPhotoInput userId={user.id} postUpload={handlePostUpload} />

            <FormField
              label="Event Title"
              name="eventTitle"
              margin={fieldMargin}
            >
              <TextInput name="eventTitle" placeholder="Enter event title" />
            </FormField>

            <FormField label="Event Date" name="eventDate" margin={fieldMargin}>
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
                    locationOther: option === "Other" ? prev.locationOther : "",
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

            <FormField label="Event Time" name="eventTime" margin={fieldMargin}>
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
}
