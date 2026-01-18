"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextArea,
  Notification,
} from "grommet";
import { Checkmark, Close } from "grommet-icons";
import moment from "moment";

import { useAccount } from "services/account";
import { useAuth } from "services/auth";

import { sendEmail } from "services/sendEmail";
import NotificationLayer from "components/NotificationLayer";

import { titleCase } from "services/helpers/textFormat";

const submitColors = {
  Reject: "brand",
  Approve: "accent-1",
  // Rejected: "dark-3",
};

const statusTitles = {
  Pending: "No Response",
  Approved: "Confirmed",
  Rejected: "Denied",
};

export default function RequestForm({
  request,
  updateRequest,
  studio_id,
  studio_email,
  isEventReq,
}) {
  const {
    request_id,
    has_response,
    response,
    requestor_name,
    studio_name,
    requestor_email,
    request_date,
    request_date_tz,
    last_update,
    messages,
    requestor_link,
    event_uuid,
    event_title,
    request_type,
  } = request;

  const { user } = useAuth();
  const { profile, updateAccount } = useAccount();

  const [values, setValues] = useState({
    message: "",
    status: !has_response ? "Pending" : response ? "Approved" : "Rejected",
  });

  const [isResponding, setIsResponding] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const onRespond = async ({ request_id, message, status }) => {
    const boolStatus = status === "Approved";

    setIsResponding(true);

    let emailError = false;
    if (message) {
      const emailDetails = {
        subject: "Arti: Response from " + studio_name,
        toEmail: [requestor_email],
        fromEmail: "requests@arti.my",
      };
      const emailVariables = {
        name: requestor_name,
        request_date,
        studio_name,
        studio_email,
        message,
        readableResponse: status,
        studio_link: "https:/arti.my/studio/" + studio_id,
        event_uuid,
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: isEventReq
          ? "responseEventRequest"
          : "responseVisitRequest",
        emailDetails,
        emailVariables,
      });
      emailError = error?.message;
    }

    const requestUpdates = {
      has_response: true,
      response: boolStatus,
      messages: [...messages, { response: message }],
    };
    const { error: updateError } = await updateRequest(
      requestUpdates,
      request_id
    );

    // only update studio account if visit is confirmed and it is not an event request
    if (boolStatus && !isEventReq) {
      let newAvailability = profile.availability;
      newAvailability.bookedTimes.push(request_date_tz.replace("T", " "));
      const updates = {
        availability: newAvailability,
      };
      await updateAccount(updates, user);
    }

    if (updateError || (message && emailError)) {
      setIsUpdateError(true);
      setIsUpdateSuccess(false);
    } else {
      setIsUpdateSuccess(true);
      setIsUpdateError(false);
    }
    setIsResponding(false);
  };

  const requestedDate = request_date;
  const createdDate = moment(
    last_update,
    "YYYY-MM-DD HH:mm:ss.SSSSSSZZ"
  ).format("D MMM YYYY, h:mm a");

  const handleSubmit = async () => {
    onRespond({
      request_id,
      message: values.message,
      status: values.status,
    });
  };

  return (
    <Box pad="medium" round="2px" gap="medium" margin={{ vertical: "medium" }}>
      {/* Request Details Section */}
      <Box gap="small">
        <Box
          border={"dark-3"}
          pad={{ horizontal: "medium", vertical: "xsmall" }}
          round="2px"
          width="fit-content"
        >
          <Text size="medium">{titleCase(request_type)}</Text>
        </Box>
        <Heading level={3} margin={{ vertical: "small" }} size="small">
          Request to {isEventReq ? "join Event" : "visit Studio"} from{" "}
          {requestor_name}
        </Heading>

        <Box gap="medium">
          {isEventReq && event_uuid && event_title && (
            <Box>
              <Text size="small" color="dark-3">
                Event
              </Text>
              <Text size="small">
                <a
                  href={"https:/arti.my/event/" + event_uuid}
                  style={{ textDecoration: "none" }}
                >
                  <u> {event_title}</u>
                </a>
              </Text>
            </Box>
          )}
          <Box>
            <Text size="small" color="dark-3">
              Requested {isEventReq ? "Event" : "Visit"} Date
            </Text>
            <Text size="small">{requestedDate}</Text>
          </Box>
          <Box>
            <Text size="small" color="dark-3">
              Request Created On
            </Text>
            <Text size="small">{createdDate}</Text>
          </Box>
          <Box>
            <Text size="small" color="dark-3">
              Your Response
            </Text>
            <Text size="small">
              {values.status === "Approved" && (
                <Checkmark size="small" color="dark-3" />
              )}{" "}
              {values.status === "Rejected" && (
                <Close size="small" color="dark-3" />
              )}
              {values.status === "Pending" && <>•</>}{" "}
              {statusTitles[values.status]}
            </Text>
          </Box>
          {messages?.[1] && (
            <Box>
              <Text size="small" color="dark-3">
                Your Last Response Message
              </Text>
              <Text size="small">
                " {messages?.[messages.length - 1]?.response} "
              </Text>
            </Box>
          )}
          <Box>
            <Text size="small" color="dark-3">
              Contact
            </Text>

            <Text size="small">{requestor_email} </Text>
          </Box>
          <Box>
            <Text size="small" color="dark-3">
              Requestor's Link
            </Text>
            <Text size="small">
              <a
                href={requestor_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <u>{requestor_link}</u>
              </a>
            </Text>
          </Box>
          <Box>
            <Text size="small" color="dark-3">
              Visit Reason
            </Text>
            <Text size="small">{messages[0].reason}</Text>
          </Box>
        </Box>
      </Box>

      {/* Response Form */}
      <Form
        values={values}
        onChange={(nextvalues) => setValues(nextvalues)}
        onSubmit={handleSubmit}
      >
        <Box gap="medium">
          <FormField name="message" required={values?.status === "Approved"}>
            <Text size="small" color="dark-3">
              Your message (* required if accepting)
            </Text>
            <TextArea
              name="message"
              placeholder={
                "Enter your response message...&#10;. &#10;" + isEventReq
                  ? ""
                  : "Please include your address in case you accept the request"
              }
              rows={6}
              resize={false}
            />
          </FormField>

          <Text size="small">
            We will deliver your message to them by email.
          </Text>
          <Box direction="row" gap="small" pad="small">
            <Button
              type="submit"
              primary
              color={submitColors["Approve"]}
              icon={<Checkmark size="small" />}
              label="Accept"
              disabled={isResponding || !values.message}
              onClick={() => setValues({ ...values, status: "Approved" })}
              width="large"
              round="2px"
            />
            <Button
              type="submit"
              primary
              color={submitColors["Reject"]}
              icon={<Close size="small" />}
              label="Reject"
              disabled={isResponding}
              onClick={() => setValues({ ...values, status: "Rejected" })}
              width="small"
              round="2px"
            />
          </Box>
        </Box>
      </Form>

      {!isResponding && (
        <>
          {isUpdateSuccess && (
            <NotificationLayer
              toast
              status="normal"
              title="Your response was sent."
              time={1500}
            />
          )}
          {isUpdateError && (
            <NotificationLayer
              toast
              status="warning"
              title="Your response was not sent!"
              message={
                <Text>
                  <br />
                  We couldn't send your response this time. Please try again.
                </Text>
              }
              time={2000}
            />
          )}
        </>
      )}
    </Box>
  );
}
