import React, { useState, useEffect, useContext } from "react";

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
} from "grommet";

import Button from "./../../Button";

import NotificationLayer from "components/NotificationLayer";

const convertToTimestampTZ = (d, t) => {
  const [year, month, day] = d.split("-");
  const time = t.includes(":") ? t : dateUtils.to24hFormat(t);
  const [hours, minutes] = time.split(":");
  const dateObj = new Date(year, month - 1, day, hours, minutes);

  // Format the Date object to include the time zone offset
  const timestamptz = dateObj.toISOString();

  return timestamptz;
};

const EventRequestForm = ({
  artistEmail,
  artistName,
  studioID,
  studio_uuid,
  event_uuid,
  event_title,
  event_date_time,
  event_date,
}) => {
  const { createRequest } = useRequests();

  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "requests@arti.my",
    from_name: "Requestor Name",
    visit_reason: "Reason to join",
    requestor_link: "Requestor Link",
  };

  const [values, setValues] = useState(initValues);

  // console.log(values);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const handleSendRequest = async () => {
    const request_id = self.crypto.randomUUID();

    const emailVariables = {
      ...values,
      studio_name: artistName,
      event_link: "https:/arti.my/event/" + event_uuid,
      event_title,
      request_id,
      event_date_time,
    };

    setIsEmailSent(false);
    setIsEmailError(false);
    setIsSendingRequest(true);

    try {
      const { requestCreated: requestinDB, error: errorInsertDB } =
        await createRequest({
          request_type: "event",

          request_date_tz: convertToTimestampTZ(String(event_date), "12:00"),
          request_date: event_date_time,
          studio_uuid,
          event_uuid,
          ...emailVariables,
        });

      const emailRequestDetails = {
        subject: "You got a new event request!",
        toEmail: [emailVariables.to_email],
        fromEmail: "Arti <requests@arti.my>",
      };

      const { emailSent: emailRequestSent, error: errorRequest } =
        await sendEmail({
          emailTemplate: "eventRequest",
          emailDetails: emailRequestDetails,
          emailVariables,
        });

      const emailRequestConfirmationDetails = {
        subject: `We sent your event request to ${emailVariables.to_name}`,
        toEmail: [emailVariables.requestor_email],
        fromEmail: "Arti <requests@arti.my>",
      };

      const { emailSent: emailConfirmationSent, error: errorConfirmation } =
        await sendEmail({
          emailTemplate: "eventRequestConfirmation",
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
    } finally {
      setIsSendingRequest(false);
    }
    setIsSendingRequest(false);
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
              regexp: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/,
              message: "Enter a valid URL",
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
          <FormField label={<Text>Reason to join</Text>} name="visit_reason">
            <TextArea
              name="visit_reason"
              placeholder="Tell the artist why you'd like to join this event."
              fill
              rows="5"
            />
          </FormField>
          <br />
          <br />

          <Box direction="row" gap="medium">
            <Button type="submit" btnStyle="filled">
              Request to join
            </Button>
          </Box>

          {isSendingRequest && (
            <Text color="#ffc0cb" size="medium">
              <br /> Sending request ...
            </Text>
          )}

          {isEmailSent ? (
            <NotificationLayer
              status="normal"
              title="Your request was sent!"
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

export default EventRequestForm;
