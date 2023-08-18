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
  RadioButtonGroup,
} from "grommet";

import Button from "./../../Button";

import { calendarBounds } from "config/calendar";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

const VisitForm = ({ artistEmail, artistName, openDates }) => {
  // TO DO: Remove in Production
  const sendingRealEmail = false;


  const hasOpenDates = openDates.length > 0;
  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "kickasso@gmail.com",
    from_name: "Requestor Name",
    message: "Hello There Message",
    visit_reason: "Reason of Visit",
    visitor_link: "Requestor Link",
    request_date: "",
  };

  const [values, setValues] = useState(initValues);
  const [selectedDate, setSelectedDate] = useState(calendarBounds.Start);
  const [selectedTime, setSelectedTime] = useState();

  const [openTimes, setOpenTimes] = useState([]);


  // console.log(values);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sendEmailError, setSendEmailError] = useState(false);



  const prepDates = (rawDate) => {
    const date = moment(rawDate, "DD/MM/YYYY hh:mm").format("YYYY-MM-DD hh:mm");
    return date;
  }

  const readableDate = (calendarDate) => moment(calendarDate, "YYYY-MM-DD hh:mm").format("D MMMM");

  const calendarDates = openDates.split(","); // .map(d => prepDates(d));

  const getDaysArray = (start, end) => {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const getDisabledArray = (start, end, openDates) => {

    const allDays = getDaysArray(new Date(start), new Date(end)).map((v) => v.toISOString().slice(0, 10));
    const openIndexes = [];

    openDates.forEach(d => {
      const i = allDays.indexOf(d.slice(0, 10));
      openIndexes.push(i);
    });

    for (let i = openIndexes.length - 1; i >= 0; i--) {
      allDays.splice(openIndexes[i], 1);
    }

    const disabled = allDays;
    return disabled;
  }

  const disabledDates = getDisabledArray(calendarBounds.Start, calendarBounds.End, calendarDates);

  const onSelectDate = (date) => {
    setSelectedDate(date);
    const times = getOpenTimes(date, calendarDates);
    setOpenTimes(times);
    setSelectedTime(times[0]);
  }


  const getOpenTimes = (date, dates) => {
    const times = dates.filter(s => s.startsWith(date)).map(d => d.split(" ")[1]);
    return times;

  }

  useEffect(() => {
    emailjs.init(USER_ID);
    if (hasOpenDates) {
      onSelectDate(calendarDates[0]);
    }
  }, []);

  const handleSendEmail = () => {
    var templateParams = { ...values, request_date: readableDate(selectedDate) + " " + selectedTime };
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
              bounds={[calendarBounds.Start, calendarBounds.End]}
              disabled={disabledDates}
            // to customize the header
            // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
            />

            {selectedDate &&
              <>
                <Text as="label" margin={{ top: "medium", bottom: "small", horizontial: "medium" }} >
                  Request a visit on <b>  {readableDate(selectedDate)}</b>
                </Text >
                <Box
                  pad="small"
                  margin={{ vertical: "medium" }}
                >
                  <RadioButtonGroup
                    name="visitTime"
                    options={openTimes}
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                  />
                </Box>
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
            name="visitor_link"
            htmlfor="text-input-id"
            label="Social or professional link"
            required
            validate={{
              regexp: /\S+.\S+\.\S+/,
              message: "Enter a valid url",
            }}
            type="url"
          >
            <MaskedInput
              name="visitor_link"
              mask={[
                { regexp: /^[\w\-_.]+$/, placeholder: "https" },
                { fixed: "://" },
                { regexp: /^[\w]+$/, placeholder: "instagram" },
                { fixed: "." },
                { regexp: /^[\w]+$/, placeholder: "com/your.profile" },
              ]}

            />
          </FormField>
          <FormField label="Reason of Visit" name="visit_reason">
            <TextArea
              name="visit_reason"
              placeholder="Just curious, Want to collaborate on a project, or Want to buy a specific artwork, or something else ..."
              fill
              required
              rows="3"
            />
          </FormField>
          <br />
          <FormField label="Message to Artist" name="message">
            <TextArea
              name="message"
              placeholder="Add a personal message, a little something about yourself, and what you like about their work. (optional)"
              fill
              rows="6"
            />
          </FormField>
          <br />
          <Box direction="row" gap="medium">
            <Button type="submit" btnStyle="filled" disabled={true}>
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
