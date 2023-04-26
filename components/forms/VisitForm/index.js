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
  TextArea,
  TextInput,
  Text,
  Calendar,
} from "grommet";

import Button from "./../../Button";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

const VisitForm = ({ artistEmail, artistName, openVisitDates }) => {
  // TO DO: Remove in Production
  const sendingRealEmail = false;


  const hasOpenDates = openVisitDates.length > 0;
  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "kickasso@gmail.com",
    from_name: "Requestor Name",
    message: "Hello There Message",
    request_date: "",
  };

  const [values, setValues] = useState(initValues);

  console.log(values);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sendEmailError, setSendEmailError] = useState(false);

  const prepDates = (rawDate) => {
    const date = moment(rawDate, "DD/MM/YYYY hh:mm").format("YYYY-MM-DD hh:mm");
    return date;
  }

  const readableDate = (calendarDate) => moment(calendarDate, "YYYY-MM-DD hh:mm").format("D MMMM - h:mm a");

  const calendarDates = openVisitDates.map(d => prepDates(d));

  const onSelectDate = (date) => {
    setValues({ ...values, request_date: readableDate(date) });
  }

  useEffect(() => {
    emailjs.init(USER_ID);
    if (hasOpenDates) {
      const firstDate = readableDate(calendarDates[0]);
      setValues({ ...values, request_date: firstDate });
    }
  }, []);

  const handleSendEmail = () => {
    var templateParams = values;

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
        <Form
          id="dddd"
          values={values}
          onChange={(nextValue) => {
            setValues({ ...values, ...nextValue });
          }}
          // onReset={() =>
          //   setValues(initValues)
          // }
          onSubmit={handleSendEmail}
          validate="blur"
        >
          <Box
            fill="horizontal"
            width="medium"
          >
            <Text as="label" margin={{ vertical: "medium", horizontial: "medium" }} >
              When to Visit?
            </Text >

            <Calendar
              onSelect={onSelectDate}
              dates={calendarDates}
              size="medium"
              margin="medium"
              bounds={['2020-09-08', '2025-12-13']}
            // to customize the header
            // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
            />

            {values.request_date &&
              <>
                <Text as="label" margin={{ top: "medium", bottom: "small", horizontial: "medium" }} >
                  Request a visit on
                </Text >
                <Text margin={{ top: "small", bottom: "medium", horizontial: "medium" }} weight="bold">
                  {values.request_date}
                </Text>
              </>
            }
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
      </Box>
    </Box>
  );
};

export default VisitForm;
