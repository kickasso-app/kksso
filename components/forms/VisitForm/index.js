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
  Calendar,
  RadioButtonGroup,
  Notification,
  ResponsiveContext,
  Anchor,
  Paragraph,
} from "grommet";

import Button from "./../../Button";

import { calendarBounds } from "config/calendar";
import NotificationLayer from "components/NotificationLayer";

import {
  parseAvailability,
  getClosedDates,
  dateUtils,
  toIsoDate,
  toReverseIsoDate,
} from "services/helpers/parseAvailability";

const VisitForm = ({
  artistEmail,
  artistName,
  openDates,
  availability,
  studioID,
  studio_uuid,
}) => {
  const { createRequest } = useRequests();

  const initValues = {
    to_email: artistEmail,
    to_name: artistName,
    requestor_email: "requests@arti.my",
    from_name: "Requestor Name",
    visit_reason: "Reason of Visit",
    requestor_link: "Requestor Link",
    request_date: "",
  };

  const [values, setValues] = useState(initValues);
  const [openTimes, setOpenTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [parsedDates, setParsedDates] = useState({});

  const [monthlyOpen, setMonthlyOpen] = useState([]);
  const [monthlyDisabled, setMonthlyDisabled] = useState([]);
  const [selectedDate, setSelectedDate] = useState(false);
  const [selectedTime, setSelectedTime] = useState(false);

  // console.log(values);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const shortReadableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  const readableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("dddd D MMMM");

  const onSelectDate = (date) => {
    setSelectedDate(date);
    const month = new Date(date).getMonth() + 1;
    const m = month.toString();

    const parsedDate = parsedDates[m].availableDates.filter(
      (d) => d.date === toReverseIsoDate(date)
    )[0];

    // console.log(parsedDate);

    let tempTimes = parsedDate.times.map((t) => dateUtils.toAmPm(t.hour));

    // onsole.log(tempTimes);
    // Check if bookedTimes has the same date and remove the times from tempTimes
    const bookedDate = bookedTimes.find(
      (bt) => bt.date === toReverseIsoDate(date)
    );
    if (bookedDate) {
      const bookedHours = bookedDate.times.map((t) =>
        dateUtils.toAmPm(t.split(":")[0])
      );

      // console.log(bookedHours);
      tempTimes = tempTimes.filter((time) => !bookedHours.includes(time));
    }

    setOpenTimes(tempTimes);
    setSelectedTime(tempTimes[0]);
  };

  const onChangeMonth = (date) => {
    // console.log(date);
    const month = new Date(date).getMonth() + 1;
    const m = month.toString();
    const dates = parsedDates;
    if (dates.hasOwnProperty(m)) {
      setBookedTimes(dates[m].bookedTimes);
      // console.log(dates[m]);

      const tempOpen = dates[m].availableDates.map((item) => item.date);

      const tempUnavail = dates[m].unavailableDates.map((item) =>
        toIsoDate(item.date)
      );

      const tempClosed = getClosedDates(tempOpen);

      // Join and remove duplicates
      const allDisabled = [...new Set([...tempClosed, ...tempUnavail])];

      setMonthlyDisabled(allDisabled);

      const disabledSet = new Set(allDisabled);
      const allOpen = tempOpen.filter((element) => !disabledSet.has(element));

      // setMonthlyOpen(allOpen);

      const nextDate = dateUtils.findNext(allOpen);
      onSelectDate(toIsoDate(nextDate));
    }
  };

  const getParsedDates = (availability) => {
    if (availability && Object.keys(parsedDates).length === 0) {
      // const exampleAvailaibity = {
      //   openTimes: [{ days: ["Wednesday", "Tuesday"], times: [9, 11, 13, 14] }],
      //   unavailableDates: [["11/03/2025", "14/03/2025"]],
      // };

      const parsedAvail = parseAvailability(availability);

      // console.log(parsedAvail);
      return parsedAvail;
    }
  };

  useEffect(() => {
    if (availability && Object.keys(parsedDates).length === 0) {
      setParsedDates(getParsedDates(availability));
    }
  }, [availability, parsedDates]);

  useEffect(() => {
    if (Object.keys(parsedDates).length !== 0) {
      const today = new Date();
      onChangeMonth(today.toISOString());
    }
  }, [parsedDates]);

  const convertToTimestampTZ = (d, t) => {
    const [year, month, day] = d.split("-");
    const time = t.includes(":") ? t : dateUtils.to24hFormat(t);
    const [hours, minutes] = time.split(":");
    const dateObj = new Date(year, month - 1, day, hours, minutes);

    // Format the Date object to include the time zone offset
    const timestamptz = dateObj.toISOString();

    return timestamptz;
  };

  const handleSendRequest = async () => {
    const request_id = self.crypto.randomUUID();

    const emailVariables = {
      ...values,
      studio_name: artistName,
      request_date: readableDate(selectedDate) + " at " + selectedTime,
      request_date_tz: convertToTimestampTZ(String(selectedDate), selectedTime),
      studio_link: "https:/arti.my/studio/" + studioID,
      request_id,
    };

    // console.log(emailVariables);
    // console.log(selectedDate + " " + selectedTime);
    // console.log(readableDate(selectedDate));
    setIsEmailSent(false);
    setIsEmailError(false);
    setIsSendingRequest(true);

    try {
      const { requestCreated: requestinDB, error: errorInsertDB } =
        await createRequest(studio_uuid, emailVariables);

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
        {availability ? (
          <Form
            id="select-visit-date"
            values={values}
            onChange={(nextValue) => {
              setValues({ ...values, ...nextValue });
            }}
            // onReset={() =>
            //   setValues(initValues)
            // }
            onSubmit={handleSendRequest}
            validate="blur"
          >
            <Box fill="horizontal" width="medium">
              <Box>
                <Calendar
                  onSelect={(date) => {
                    onSelectDate(date);
                  }}
                  date={selectedDate}
                  onReference={onChangeMonth}
                  size="medium"
                  margin="none"
                  bounds={calendarBounds}
                  daysOfWeek={true}
                  firstDayOfWeek={1}
                  disabled={monthlyDisabled}
                  showAdjacentDays={false}

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
              name="requestor_link"
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
              <Button type="submit" btnStyle="filled" disabled={!selectedDate}>
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

            {/* {isDatePast && (
            <Text color="#ffc0cb" size="medium">
              <br /> You selected a day in the past
            </Text>
          )} */}

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
        ) : (
          <Paragraph size="medium">
            There are no available dates yet for this studio.
          </Paragraph>
        )}
      </Box>
    </Box>
  );
};

export default VisitForm;
