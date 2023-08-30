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
  Notification,
} from "grommet";

import Button from "./../../Button";

import { calendarBounds } from "config/calendar";

const SERVICE_ID = "default_service"; // process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

// TO DO: Remove in Production
const SEND_REAL_EMAIL = true;

const VisitForm = ({ artistEmail, artistName, openDates }) => {
  // TO DO: Remove in Production
  const sendingRealEmail = false;

  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "kickasso@gmail.com",
    from_name: "Requestor Name",
    message_to_artist: "Hello There Message",
    visit_reason: "Reason of Visit",
    visitor_link: "Requestor Link",
    request_date: "",
  };


  const [values, setValues] = useState(initValues);
  const [calendarDates, setCalendarDates] = useState([]);
  const [datesWithTimes, setDatesWithTimes] = useState([]);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  const [openTimes, setOpenTimes] = useState([]);


  // console.log(values);
  // const [sendingEmail, setSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);


  const readableDate = (date) => moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

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


  const onSelectDate = (newdate, optionalDatesWithTimes) => {
    const date = newdate.split("T")[0];
    const dates = optionalDatesWithTimes || datesWithTimes;
    setSelectedDate(date);
    const newTimes = dates.filter(d => d.date === date)[0]?.times;
    if (newTimes?.length > 0) {
      setOpenTimes(newTimes);
      setSelectedTime(newTimes[0]);
    }
    else {
      setOpenTimes([]);
    }
  }

  const prepCalendarDates = (dates) => {
    const uniqueCalendarDates = dates.map(d => d.split(" ")[0] + "T12:22:00Z").filter((value, index, self) => self.indexOf(value) === index);
    return uniqueCalendarDates;
  }

  const prepDatesWithTimes = (dates) => {
    const datesTimes = [];
    const uniqueDatesOnly = dates.map(d => d.split(" ")[0]).filter((value, index, self) => self.indexOf(value) === index);

    uniqueDatesOnly.forEach(date => {
      const times = openDates.filter(s => s.startsWith(date)).map(d => d.split(" ")[1]);
      datesTimes.push({ "date": date, "times": times });
    });
    return datesTimes;
  }


  useEffect(() => {
    emailjs.init(USER_ID);
    if (openDates && !selectedDate) {
      const tempCalendarDates = prepCalendarDates(openDates);
      const tempDatesWithTimes = prepDatesWithTimes(openDates)
      setCalendarDates(tempCalendarDates);
      setDatesWithTimes(tempDatesWithTimes);
      onSelectDate(tempCalendarDates[0], tempDatesWithTimes);
    }
  }, []);


  const handleSendEmail = () => {
    const templateParams = {
      ...values,
      request_date: readableDate(selectedDate) + " " + selectedTime,

    };
    console.log(templateParams);

    if (SEND_REAL_EMAIL) {
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID).then(
        function (response) {
          console.log(response.status, response.text);
          setIsEmailSent(true);
        },
        function (err) {
          console.log(err);
          setIsEmailError(err);
        }
      );
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
              date={selectedDate}
              size="medium"
              margin="medium"
              bounds={[calendarBounds.Start, calendarBounds.End]}
              disabled={disabledDates}
            // to customize the header
            // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
            />

            {selectedTime &&
              <>
                <Text as="label" margin={{ top: "medium", bottom: "small", horizontial: "medium" }} >
                  Request a visit on <b>  {readableDate(selectedDate)}</b> at
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
              name="message_to_artist"
              placeholder="Add a personal message, a little something about yourself, and what you like about their work. (optional)"
              fill
              rows="6"
            />
          </FormField>
          <br />
          <Box direction="row" gap="medium">
            <Button type="submit" btnStyle="filled" disabled={false}>
              Request A Visit
            </Button>
          </Box>

          {isEmailSent ? (
            <Notification
              toast={{
                autoClose: false,
                position: 'bottom-right',
              }}
              status="normal"
              title="Your visit request was sent!"
              message={<Text><br />Please wait to hear back from the artist's studio to confirm the visit.
                We sent you an email with the request details.</Text>}
              onClose={() => setIsEmailSent(false)}
            />
          ) : (
            isEmailError && (
              <Notification
                toast
                status="warning"
                title="We couldn't send your request!"
                message={<Text><br />Please try again, and if it doesn't work, reach out to us.</Text>}
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

export default VisitForm;
