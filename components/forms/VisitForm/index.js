import React, { useState, useEffect, useContext } from "react";

import { sendEmail } from "services/sendEmail";

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
  RadioButtonGroup,
  Notification,
  ResponsiveContext,
  Anchor,
} from "grommet";

import Button from "./../../Button";

import { calendarBounds } from "config/calendar";

const VisitForm = ({ artistEmail, artistName, openDates, studioID }) => {
  const size = useContext(ResponsiveContext);

  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "requests@arti.my",
    from_name: "Requestor Name",
    visit_reason: "Reason of Visit",
    visitor_link: "Requestor Link",
    request_date: "",
  };

  const [values, setValues] = useState(initValues);
  const [calendarDates, setCalendarDates] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [datesWithTimes, setDatesWithTimes] = useState([]);

  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedTime, setSelectedTime] = useState(false);

  const [openTimes, setOpenTimes] = useState([]);

  const [isDatePast, setIsDatePast] = useState(false);

  // console.log(values);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const shortReadableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  const readableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("dddd D MMMM");

  const getDaysArray = (start, end) => {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const getDisabledArray = (start, end, openDates) => {
    if (selectedDate === false) {
      const allDays = getDaysArray(new Date(start), new Date(end)).map((v) =>
        v.toISOString().slice(0, 10)
      );
      const openIndexes = [];

      openDates.forEach((d) => {
        const i = allDays.indexOf(d.slice(0, 10));
        openIndexes.push(i);
      });

      for (let i = openIndexes.length - 1; i >= 0; i--) {
        allDays.splice(openIndexes[i], 1);
      }

      const disabled = allDays;
      return disabled;
    }
  };

  const onSelectDate = (newdate, optionalDatesWithTimes = false) => {
    const date = newdate.split("T")[0];

    if (date !== selectedDate) {
      const dates = optionalDatesWithTimes || datesWithTimes;

      setSelectedDate([date]);
      const newTimes = dates.filter((d) => d.date === date)[0]?.times;
      // console.log("new times", newTimes);
      if (newTimes?.length > 0) {
        setOpenTimes(newTimes);
        setSelectedTime(newTimes[0]);
      } else {
        setOpenTimes([]);
      }

      const isPast = moment(date).diff(moment().format("YYYY-MM-DD")) < 0;
      setIsDatePast(isPast);
    }
    // console.log("SELECTED DATE")
    // console.log(date + " " + newTimes[0])

    return true;
  };

  const prepCalendarDates = (dates) => {
    const uniqueCalendarDates = dates
      .map((d) => d.split(" ")[0] + "T12:22:00Z")
      .filter((value, index, self) => self.indexOf(value) === index);

    uniqueCalendarDates.sort();
    //    console.log("unique", uniqueCalendarDates);

    return uniqueCalendarDates;
  };

  const prepDatesWithTimes = (dates) => {
    const datesTimes = [];
    const uniqueDatesOnly = dates
      .map((d) => d.split(" ")[0])
      .filter((value, index, self) => self.indexOf(value) === index);

    uniqueDatesOnly.sort();

    uniqueDatesOnly.forEach((date) => {
      const times = openDates
        .filter((s) => s.startsWith(date))
        .map((d) => d.split(" ")[1]);
      datesTimes.push({ date: date, times: times });
    });
    return datesTimes;
  };

  const getFirstFutureDate = (dates) => {
    let firstFutureDate = dates[0];

    for (let i = 0; i < dates.length; i++) {
      const isDateinFuture =
        moment(dates[i]).diff(moment().format("YYYY-MM-DD")) >= 0;

      // console.log(dates[i], isDateinFuture);
      if (isDateinFuture) {
        firstFutureDate = dates[i];
        break;
      }
    }
    return firstFutureDate;
  };

  // let disabledDates = [];

  useEffect(() => {
    if (openDates?.length > 0) {
      const tempCalendarDates = prepCalendarDates(openDates);
      const tempDatesWithTimes = prepDatesWithTimes(openDates);

      setCalendarDates(tempCalendarDates);
      setDatesWithTimes(tempDatesWithTimes);

      const isFirstDateinFuture =
        moment(tempCalendarDates[0]).diff(moment().format("YYYY-MM-DD")) >= 0;

      const firstSelectedDate = isFirstDateinFuture
        ? tempCalendarDates[0]
        : getFirstFutureDate(tempCalendarDates);

      onSelectDate(firstSelectedDate, tempDatesWithTimes);
      setDisabledDates(
        getDisabledArray(
          calendarBounds.Start,
          calendarBounds.End,
          tempCalendarDates
        )
      );
    }
  }, []);

  const handleSendEmail = async () => {
    const emailVariables = {
      ...values,
      request_date: readableDate(selectedDate) + " at " + selectedTime,
      studio_link: "https:/arti.my/studio/" + studioID,
    };
    // console.log(emailVariables);

    setIsSendingRequest(true);

    try {
      const emailRequestDetails = {
        subject: "You got a new studio visit request!",
        toEmail: [emailVariables.to_email],
        fromEmail: "requests@arti.my",
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
        fromEmail: "requests@arti.my",
      };

      const { emailSent: emailConfirmationSent, error: errorConfirmation } =
        await sendEmail({
          emailTemplate: "visitRequestConfirmation",
          emailDetails: emailRequestConfirmationDetails,
          emailVariables,
        });

      if (emailRequestSent && emailConfirmationSent) {
        setIsEmailSent(true);
      }
      if (errorRequest || errorConfirmation) {
        // console.log(errorRequest);
        // console.log(errorConfirmation);
        setIsEmailError(errorRequest?.message + errorConfirmation?.message);
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
      <Box
        width="large"
        // pad="medium"
        margin={{ vertical: "medium" }}
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
          <Box fill="horizontal" width="medium">
            <Box>
              <Calendar
                onSelect={(date) => {
                  onSelectDate(date);
                }}
                date={selectedDate}
                // size={size === "small" ? "small" : "medium"}
                // margin={size === "small" ? "medium" : "small"}
                size="medium"
                margin="none"
                bounds={[calendarBounds.Start, calendarBounds.End]}
                daysOfWeek={true}
                firstDayOfWeek={1}
                disabled={disabledDates}
                // to customize the header
                // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
              />
            </Box>

            {selectedTime && (
              <>
                <Text
                  as="label"
                  margin={{
                    top: "medium",
                    bottom: "xsmall",
                    horizontial: "medium",
                  }}
                >
                  Request a visit on <b> {shortReadableDate(selectedDate)}</b>{" "}
                  at
                </Text>
                <Box pad="small" margin={{ vertical: "small" }}>
                  <RadioButtonGroup
                    name="visitTime"
                    options={openTimes}
                    value={selectedTime}
                    onChange={(event) => {
                      setSelectedTime(event.target.value);
                      // console.log("selected " + event.target.value);
                    }}
                  />
                </Box>
              </>
            )}
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
              regex: /\S+.\S+\.\S+?.\S+/,
              message: "Enter a valid url",
            }}
            type="url"
          >
            <MaskedInput
              name="visitor_link"
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
          <FormField
            label={<Text>Reason of visit / Grund des Besuchs</Text>}
            name="visit_reason"
          >
            <TextArea
              name="visit_reason"
              placeholder="Just curious, Want to collaborate on a project, or Want to buy a specific artwork, or something else... &#10;. &#10;Feel free to add here a personal message, a little something about yourself, and what you like about their work."
              fill
              required
              rows="7"
            />
          </FormField>
          <br />
          {/* <FormField
            label={
              <Text>
                Message to artist <br />/ Nachricht an den oder die
                Künstlerin*in{" "}
              </Text>
            }
            name="message"
          >
            <TextArea
              name="message_to_artist"
              placeholder="Add a personal message, a little something about yourself, and what you like about their work. (optional)"
              fill
              rows="6"
            />
          </FormField> */}
          <br />

          <Box direction="row" gap="medium">
            <Button type="submit" btnStyle="filled" disabled={isDatePast}>
              Request a visit
            </Button>
          </Box>
          {selectedTime && (
            <>
              <Text>
                on {readableDate(selectedDate)} at {selectedTime}
              </Text>
            </>
          )}

          {isDatePast && (
            <Text color="#ffc0cb" size="medium">
              <br /> You selected a day in the past
            </Text>
          )}

          {isSendingRequest && (
            <Text color="#ffc0cb" size="medium">
              <br /> Sending request ...
            </Text>
          )}

          {isEmailSent ? (
            <Notification
              toast={{
                autoClose: false,
                position: "bottom-right",
              }}
              status="normal"
              title="Your visit request was sent!"
              message={
                <Text>
                  <br />
                  Please wait to hear back from the artist's studio to confirm
                  the visit. We sent you an email with the request details.
                </Text>
              }
              onClose={() => setIsEmailSent(false)}
            />
          ) : (
            isEmailError && (
              <Notification
                toast
                status="warning"
                title="We couldn't send your request!"
                message={
                  <Text>
                    <br />
                    Please try again, and if it doesn't work, reach out to us.
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

export default VisitForm;
