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
import { sendEmail } from "services/sendEmail";

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
    messages,
    requestor_link,
  } = request;

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
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: "responseTemplate",
        emailDetails,
        emailVariables,
      });
      emailError = error?.message;
    }

    // TODO: remove time from openTimes
    //  await updateAccount({ openTimes }, user);
    const requestUpdates = {
      has_response: true,
      response: boolStatus,
      messages: [...messages, { response: message }],
    };
    const { error: updateError } = await updateRequest(
      requestUpdates,
      request_id
    );

    if (updateError || (message && emailError)) {
      setIsUpdateError(true);
      setIsUpdateSuccess(false);
    } else {
      setIsUpdateSuccess(true);
      setIsUpdateError(false);
    }
    setIsResponding(false);
  };

  const formattedDate = request_date;

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
        <Heading level={3} margin={{ vertical: "small" }} size="small">
          Visit request from {requestor_name}
        </Heading>

        <Box gap="medium">
          <Box>
            <Text size="small" color="dark-3">
              Date
            </Text>
            <Text size="small">{formattedDate}</Text>
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
              placeholder="Enter your response message...&#10;. &#10;Please include your address in case you accept the visit request"
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
            <Notification
              toast
              status="normal"
              title="Your response was sent."
            />
          )}
          {isUpdateError && (
            <Notification
              toast
              status="warning"
              title="Your response was not sent!"
              message="We couldn't send your response this time. Please try again."
              // onClose={() => {}}
            />
          )}
        </>
      )}
    </Box>
  );
}
