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
  RadioButtonGroup,
} from "grommet";

import Button from "components/Button";

import { calendarBounds } from "config/calendar";
import WeekdayTimeSelector from "./weekday-time-selector";
import DateRangeSelector from "./date-range-selector";
import StudioSettingsForm from "./StudioSettingsForm";

import {
  parseAvailability,
  toIsoDate,
} from "services/helpers/parseAvailability";

export default function VisitsSettingsForm({
  profile: {
    availability,
    hasOpenDates,
    visitRules,
    textStudio,
    location,
    district,
    has_no_visits,
  },
}) {
  const { user } = useAuth();
  const {
    updateAccount,
    loading,
    isUpdateSuccess,
    isUpdateError,
  } = useAccount();


  const [disabledVisits, setDisabledVisits] = useState(has_no_visits ?? false);
  const [values, setValues] = useState({
    availability,
  });
  const [parsedDates, setParsedDates] = useState({});

  const [monthlyOpen, setMonthlyOpen] = useState([]);
  const [monthlyDisabled, setMonthlyDisabled] = useState([]);

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

  useEffect(() => {
    if (Object.keys(parsedDates).length !== 0) {
      const today = new Date();
      onChangeMonth(today.toISOString());
    }
  }, [parsedDates]);

  const onChangeAvailability = ({ openTimes, unavailableDates }) => {
    if (openTimes) {
      setValues({ availability: { ...values.availability, openTimes } });
    }

    if (unavailableDates) {
      setValues({ availability: { ...values.availability, unavailableDates } });
    }
  };
  async function updateProfile(event) {
    const updates = event.target.value;
    //console.log(updates);
    await updateAccount(updates, user);
  }

  async function updateProfileForDisabledVisits(event) {
    const isDisabled = event.target.value === 'Disable' ? true : false;
    const updates = { "has_no_visits": isDisabled };
    //console.log(updates);

    await updateAccount(updates, user);
    setDisabledVisits(isDisabled);
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

          <Box margin={textMargin}>
            <Heading level={4} size="small" margin={{ bottom: "small" }}>
              Disable Visits
            </Heading>
            <Text margin={{ bottom: "small" }}>
              Toggle to stop receiving visit requests. You can re-enable visits later.
            </Text>
            <Box direction="row" gap="small">
              <RadioButtonGroup
                name="hasNoVisits"
                options={['Enable', 'Disable']}
                value={disabledVisits ? 'Disable' : 'Enable'}
                onChange={updateProfileForDisabledVisits}
              />
            </Box>
            <br />
          </Box>
          {disabledVisits || (<>
          <Heading level={4} size="medium" margin={textMargin}>
            Weekly Availability
          </Heading>
          <WeekdayTimeSelector
            openTimes={availability?.openTimes}
            onUpdate={onChangeAvailability}
          />

          <Heading level={4} margin={textMargin}>
            Unavailable Dates
          </Heading>
          <Text margin={textMargin}>
            These are times when you are away from your studio or don't want to
            recieve visit requests.
          </Text>
          <DateRangeSelector
            unavailableDates={availability?.unavailableDates}
            onUpdate={onChangeAvailability}
          />

          <Form
            value={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() => setValues(profile)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <Text>
              Please save the dates and times you entered and review them in the
              calendar below.
            </Text>

            <Box direction="row" gap="medium" margin={fieldMargin}>
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Save Changes
              </Button>
            </Box>
            <Row>
              <Col xs={12} md={8}>
                <Calendar
                  onSelect={() => false}
                  dates={monthlyOpen}
                  size="medium"
                  daysOfWeek={true}
                  firstDayOfWeek={1}
                  bounds={calendarBounds}
                  showAdjacentDays={false}
                  onReference={onChangeMonth}
                  disabled={monthlyDisabled}
                />
              </Col>
            </Row>

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
            </Form></>)}
        </Grid>
      </Box>
    </Box>
  );
}
