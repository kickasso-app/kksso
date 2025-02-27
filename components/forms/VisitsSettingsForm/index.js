import { useState, useEffect } from "react";

import moment from "moment";

import { useAuth } from "services/auth";
import { useAccount } from "services/account";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import {
  Box,
  Form,
  FormField,
  Notification,
  CheckBoxGroup,
  Calendar,
  TextArea,
  TextInput,
  Text,
  Heading,
} from "grommet";

import Button from "components/Button";

import { calendarBounds } from "config/calendar";
import WeekdayTimeSelector from "./weekday-time-selector";
import DateRangeSelector from "./date-range-selector";
import StudioSettingsForm from "./StudioSettingsForm";

import { parseAvailability } from "services/helpers/parseAvailability";

export default function VisitsSettingsForm({
  profile: {
    visitRules,
    availability,
    hasOpenDates,
    textStudio,
    location,
    district,
    events,
    eventsLink,
    eventsContact,
  },
}) {
  const { user } = useAuth();
  const {
    updateAccount,
    calendarDate,
    updateCalendarDate,
    loading,
    isUpdateSuccess,
    isUpdateError,
  } = useAccount();

  const [values, setValues] = useState({
    visitRules,
    location: location.join(","),
    district,
    textStudio,
    events,
    eventsLink,
    eventsContact,
  });
  const [parsedDates, setParsedDates] = useState({});

  const [monthlyOpen, setMonthlyOpen] = useState([]);
  const [monthlyDisabled, setMonthlyDisabled] = useState([]);

  const toIsoDate = (date) => moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");

  // const readableDate = (date) =>
  //   moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  const formatDisabled = (a) =>
    a?.unavailableDates.map((x) => x.map(toIsoDate));

  const onChangeMonth = (date) => {
    const month = new Date(date).getMonth() + 1;
    const m = month.toString();
    const dates = parsedDates;

    if (dates.hasOwnProperty(m)) {
      // console.log(dates);

      const tempOpen = dates[m].availableDates.map(
        (item) => toIsoDate(item.date) + "T13:52:26.780Z"
      );

      // console.log(tempOpen);
      setMonthlyOpen(tempOpen);

      const tempDisabled = dates[m].unavailableDates.map((item) =>
        toIsoDate(item.date)
      );

      setMonthlyDisabled(tempDisabled);
    }
  };

  const getParsedDates = (availability) => {
    if (availability && Object.keys(parsedDates).length === 0) {
      // const exampleAvailaibity = {
      //   openTimes: [{ days: ["Wednesday", "Tuesday"], times: [9, 11, 13, 14] }],
      //   unavailableDates: [["11/03/2025", "14/03/2025"]],
      // };

      const parsedAvail = parseAvailability(availability);
      return parsedAvail;
    }
  };

  useEffect(() => {
    if (availability && Object.keys(parsedDates).length === 0) {
      setParsedDates(getParsedDates(availability));
    }
  }, [availability, parsedDates]);

  async function updateProfile(event) {
    const newDates = updateOpenDates();

    const updates = {
      ...values,
      location: values.location.split(","),
      openDates: newDates,
    };

    await updateAccount(updates, user);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { vertical: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium" gap="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Studio
        </Heading>
        {user && (
          <StudioSettingsForm
            profile={{ visitRules, textStudio, location, district }}
          />
        )}
        {/* <Heading level="3" size="medium" margin={fieldMargin}>
          Your Visit Settings
        </Heading> */}

        <Grid fluid>
          <Heading level="3" size="medium" margin={fieldMargin}>
            Your Visit Times
          </Heading>

          <Heading level={4} size="medium" margin={textMargin}>
            Weekly Availability
          </Heading>
          <WeekdayTimeSelector />

          <Heading level={4} margin={textMargin}>
            Unavailable Dates
          </Heading>
          <Text margin={textMargin}>
            These are times when you are away from your studio or don't want to
            recieve visit requests.
          </Text>
          <DateRangeSelector />

          <Form
            value={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() => setValues(profile)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <Row>
              <Col xs={12} md={8}>
                <Calendar
                  onSelect={() => false}
                  dates={monthlyOpen}
                  size="medium"
                  daysOfWeek={true}
                  firstDayOfWeek={1}
                  // margin="medium"
                  bounds={[calendarBounds.Start, calendarBounds.End]}
                  showAdjacentDays={false}
                  onReference={onChangeMonth}
                  disabled={monthlyDisabled}
                  // disabled={availability ? formatDisabled(availability) : []}
                  // to customize the header
                  // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
                />
                <Text>
                  {" "}
                  Please review your calendar and save the dates and times you
                  entered.
                </Text>
                <br />
                <br />
              </Col>
              {/* <Col xs={12} md={4}>
                <Text>
                  <b>
                    {readableDate(calendarDate)}
                    <br />
                    <br />
                  </b>

                  <CheckBoxGroup
                    value={selectedTimes}
                    onChange={({ value: nextValue }) => {
                      onChangeTimes(nextValue);
                    }}
                    options={[
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                    ]}
                  />
                </Text>
              </Col> */}
            </Row>

            <Box direction="row" gap="medium" margin={fieldMargin}>
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Save Changes
              </Button>
            </Box>

            {!loading && (
              <>
                {isUpdateSuccess && (
                  <Notification
                    toast
                    status="normal"
                    title="Your profile was updated."
                  />
                )}
                {isUpdateError && (
                  <Notification
                    toast
                    status="warning"
                    title="Your profile was not updated!"
                    message="We couldn't complete your request this time. Please try again."
                    // onClose={() => {}}
                  />
                )}
              </>
            )}
          </Form>
        </Grid>
      </Box>
    </Box>
  );
}
