import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

import * as emailjs from "emailjs-com";

import moment from "moment";

import { CheckCircle, XCircle } from "react-feather";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  RadioButtonGroup,
  TextArea,
  TextInput,
  Text,
  Grommet,
} from "grommet";

import Button from "./../../Button";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

const VisitForm = ({ artistEmail, artistName, openVisitDates }) => {
  const [values, setValues] = useState({
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "kickasso@gmail.com",
    from_name: "Requestor Name",
    message: "Hello There Message",
    request_date: "Tomorrow 2pm",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sendEmailError, setSendEmailError] = useState(false);
  // Remove in Production
  const sendingRealEmail = false;

  useEffect(() => {
    emailjs.init(USER_ID);
  }, []);

  const handleSendEmail = () => {
    var templateParams = values;
    console.log(templateParams);

    if (isEmailSent === false && sendingRealEmail) {
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID).then(
        function (response) {
          console.log(response.status, response.text);
          setIsEmailSent(true);
        },
        function (err) {
          console.log(err);
          setSendEmailError(err);
        }
      );
      setIsEmailSent(true);
    } else {
      // Remove in Production
      console.log("Not sending for now, just testing!");
      setIsEmailSent(true);
    }
  };

  return (
    <Box align="center" justify="center">
      <Box
        width="large"
        // pad="medium"
        margin={{ vertical: "large" }}
      >
        <Grommet>
          <Form
            id="dddd"
            values={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() =>
              setValues({
                to_email: artistEmail,
                to_name: artistName,
                requestor_email: "Requestor email",
                from_name: "Requestor Name",
                message: "Hello There Message",
                request_date: "",
              })
            }
            onSubmit={handleSendEmail}
            validate="blur"
          >
            <FormField
              name="request_date"
              label="When to Visit?"
              required
              component={RadioButtonGroup}
              options={openVisitDates.map((date) =>
                moment(date, "DD/MM/YYYY hh:mm").format("D MMM - h:mm a")
              )}
            />

            <FormField
              name="from_name"
              htmlfor="text-input-id"
              label="Name"
              required
            >
              <TextInput
                id="text-input-id"
                name="from_name"
                placeholder="Your Name"
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
            <FormField label="Message to artist" name="message">
              <TextArea
                name="message"
                placeholder="Add a little something about you and why you want to visit the artist’s studio and what you like about their work. (optional)"
                fill
              />
            </FormField>
            <br />
            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={isEmailSent}>
                Request A Visit
              </Button>
            </Box>

            {isEmailSent ? (
              <>
                <Text>
                  <CheckCircle size={24} color="#C0FFF4" strokeWidth={3} />
                  <br />
                  We just sent your request to the artist!
                  <br /> Please wait to hear back from them to confirm the visit
                  details.
                </Text>
              </>
            ) : (
              sendEmailError && (
                <Text>
                  <XCircle size={24} color="#FFC0CB" strokeWidth={3} />
                  <br />
                  We couldn't send your request this time.
                  <br />
                  Please try again.
                </Text>
              )
            )}
          </Form>
        </Grommet>
      </Box>
    </Box>
  );
};

export default VisitForm;
