import React, { useState } from "react";

import { sendEmail } from "services/sendEmail";
import { useRequests } from "services/requests";

import moment from "moment";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  TextArea,
  TextInput,
  Text,
  Calendar,
  Select,
} from "grommet";

import Button from "components/Button";

import { calendarBounds } from "config/calendar";
import NotificationLayer from "components/NotificationLayer";

const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Start from 8 AM
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
});

const VisitFormOpen = ({ artistEmail, artistName, studioID, studio_uuid }) => {
  const { createRequest } = useRequests();

  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "requests@arti.my",
    from_name: "Requestor Name",
    visit_reason: "Reason of Visit",
    requestor_link: "Requestor Link",
    request_date: "",
    request_time: "",
  };

  const [values, setValues] = useState(initValues);
  const [selectedDate, setSelectedDate] = useState();
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const readableDate = (date) => moment(date).format("dddd D MMMM");

  const onSelectDate = (date) => {
    if (date !== selectedDate) {
      // date is an ISO-like YYYY-MM-DD string from Grommet Calendar
      setSelectedDate(date);
    }
  };

  const convertToTimestampTZ = (d, t) => {
    if (!d || !t) return null;
    const [year, month, day] = d.split("-");
    const [timeStr, period] = t.split(" ");
    const [hours] = timeStr.split(":");
    let hour = parseInt(hours);

    // Convert to 24 hour format
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const dateObj = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hour,
      0
    );
    return dateObj.toISOString();
  };

  const handleSendRequest = async () => {
    const request_id = self.crypto.randomUUID();

    const chosenDate = moment(selectedDate).format("YYYY-MM-DD");
    const chosenTime = values.request_time;

    const emailVariables = {
      ...values,
      studio_name: artistName,
      request_date: readableDate(chosenDate) + " at " + chosenTime,
      request_date_tz: convertToTimestampTZ(String(chosenDate), chosenTime),
      studio_link: "https:/arti.my/studio/" + studioID,
      request_id,
    };

    console.log(emailVariables);
    // console.log(selectedDate + " " + selectedTime);
    // console.log(readableDate(selectedDate));
    setIsEmailSent(false);
    setIsEmailError(false);
    setIsSendingRequest(true);

    try {
      const { requestCreated: requestinDB, error: errorInsertDB } =
        await createRequest({
          request_type: "visit",
          studio_uuid: studio_uuid,
          event_uuid: null,
          ...emailVariables,
        });

      const emailRequestDetails = {
        subject: "You got a new studio visit request!",
        toEmail: [emailVariables.to_email],
        fromEmail: "Arti <requests@arti.my>",
      };

      const { emailSent: emailRequestSent, error: errorRequest } =
        await sendEmail({
          emailTemplate: "visitRequest",
          emailDetails: emailRequestDetails,
          emailVariables,
        });

      const emailRequestConfirmationDetails = {
        subject: `We sent your studio visit request to ${emailVariables.to_name}`,
        toEmail: [emailVariables.requestor_email],
        fromEmail: "Arti <requests@arti.my>",
      };

      const { emailSent: emailConfirmationSent, error: errorConfirmation } =
        await sendEmail({
          emailTemplate: "visitRequestConfirmation",
          emailDetails: emailRequestConfirmationDetails,
          emailVariables,
        });

      if (requestinDB && emailRequestSent && emailConfirmationSent) {
        setIsEmailSent(true);
      }
      if (errorRequest || errorConfirmation || errorInsertDB) {
        console.log(
          errorInsertDB?.message +
            " " +
            errorRequest?.message +
            " " +
            errorConfirmation?.message
        );
        setIsEmailError(true);
      }
    } catch (error) {
      console.log(error);
      setIsEmailError(true);
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <Box align="center" justify="center">
      <Box width="large" margin={{ vertical: "medium" }}>
        <Form
          id="select-visit-date"
          values={values}
          onChange={(nextValue) => {
            setValues({ ...values, ...nextValue });
          }}
          onSubmit={handleSendRequest}
          validate="blur"
        >
          <Box fill="horizontal" width="medium">
            <Box>
              <Calendar
                onSelect={onSelectDate}
                date={selectedDate}
                size="medium"
                margin="none"
                bounds={calendarBounds}
                daysOfWeek={true}
                firstDayOfWeek={1}
                showAdjacentDays={false}
              />
            </Box>

            <Box direction="row" align="center" gap="small">
              <FormField label="Time" name="request_time" required>
                <Select
                  name="request_time"
                  options={hours}
                  value={values.request_time || ""}
                  onChange={({ option }) =>
                    setValues((v) => ({ ...v, request_time: option }))
                  }
                  placeholder="Select time"
                />
              </FormField>
            </Box>
          </Box>

          <FormField
            name="from_name"
            htmlfor="text-input-id"
            label="Name"
            required
          >
            <TextInput
              id="text-input-id"
              name="from_name"
              placeholder="Your name"
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
          </FormField>
          <FormField
            name="requestor_link"
            htmlfor="text-input-id"
            label="Social or professional link"
            required
            validate={{
              regexp: /\S+.\S+\.\S+?.\S+/,
              message: "Enter a valid url",
            }}
            type="url"
          >
            <MaskedInput
              name="requestor_link"
              mask={[
                { regexp: /^[\w\-_.]+$/, placeholder: "https" },
                { fixed: "://" },
                { regexp: /^[\w]+$/, placeholder: "www" },
                { fixed: "." },
                { regexp: /^[\w]+$/, placeholder: "instagram" },
                { fixed: "." },
                { regexp: /^[\w]+$/, placeholder: "com" },
                { fixed: "/" },
                { regexp: /^.*$/, placeholder: "yourProfile" },
              ]}
            />
          </FormField>
          <FormField label={<Text>Reason of visit </Text>} name="visit_reason">
            <TextArea
              name="visit_reason"
              placeholder="Just curious, Want to collaborate on a project, or Want to buy a specific artwork, or something else... &#10;. &#10;Feel free to add here a personal message, a little something about yourself, and what you like about their work."
              fill
              required
              rows="7"
            />
          </FormField>

          <br />

          <Box direction="row" gap="medium">
            <Button
              type="submit"
              btnStyle="filled"
              disabled={
                !selectedDate || !values.request_time || isSendingRequest
              }
            >
              Request a visit
            </Button>
          </Box>

          {selectedDate && values.request_time && (
            <Text>
              on {readableDate(selectedDate)} at {values.request_time}
            </Text>
          )}

          {isSendingRequest && (
            <Text color="#ffc0cb" size="medium">
              <br /> Sending request ...
            </Text>
          )}

          {isEmailSent ? (
            <NotificationLayer
              status="normal"
              title="Your visit request was sent!"
              message={
                <Text>
                  <br />
                  Please wait to hear back from us when the studio responds.
                </Text>
              }
              onClose={() => setIsEmailSent(false)}
            />
          ) : (
            isEmailError && (
              <NotificationLayer
                toast
                status="warning"
                title="We couldn't send your request!"
                message={
                  <Text>
                    <br />
                    Please try again, and reach out to us if you face an issue
                    again.{" "}
                  </Text>
                }
                onClose={() => setIsEmailError(false)}
                time="2000"
              />
            )
          )}
        </Form>
      </Box>
    </Box>
  );
};

export default VisitFormOpen;
