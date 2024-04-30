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

export default function VisitsSettingsForm({
  profile: {
    visitRules,
    openDates,
    hasOpenDates,
    textStudio,
    city,
    events,
    eventsContact,
    // address,
    // directions,
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
    openDates,
    city,
    textStudio,
    events,
    eventsContact,
    // directions,
    // address,
  });

  const [selectedTimes, setSelectedTimes] = useState([]);

  const getSelectedTimes = (date, dates) => {
    const timeData = dates?.length
      ? dates
          .filter((s) => s.startsWith(date))
          .map((d) => d.split(" ")[1])
          .sort()
      : [];
    return timeData;
  };

  useEffect(() => {
    if (!openDates) {
      updateAccount({ openDates: [] }, user);
    } else if (openDates?.length > 0) {
      const tempTimes = getSelectedTimes(calendarDate, openDates);
      setSelectedTimes(tempTimes);
    }
  }, [calendarDate]);

  const onChangeTimes = (times) => {
    setSelectedTimes(times.sort());
  };

  const areTimesDifferent = () => {
    const oldTimes = getSelectedTimes(calendarDate, openDates);
    return JSON.stringify(selectedTimes) !== JSON.stringify(oldTimes);
  };

  const onChangeDate = async (date) => {
    const isUpdateNeeded = areTimesDifferent();

    if (isUpdateNeeded) {
      // console.log("update needed");
      const newDates = updateOpenDates();
      updateAccount({ openDates: newDates }, user);
    }
    updateCalendarDate(date);
  };

  const updateOpenDates = () => {
    // remove old times
    // then add new ones
    const dates = openDates.filter((s) => !s.startsWith(calendarDate));

    selectedTimes.forEach((t) => dates.push(calendarDate + " " + t));

    const newDates = dates.sort();
    return newDates;
  };

  const readableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  // const disabledDates = [["2023-09-01", "2023-09-15"]];

  async function updateProfile(event) {
    const newDates = updateOpenDates();

    const updates = {
      ...values,
      openDates: newDates,
    };

    await updateAccount(updates, user);
  }

  const fieldMargin = { vertical: "large" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium" gap="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Your Visit Settings
        </Heading>

        <Grid fluid>
          <Form
            value={values}
            onChange={(nextValue) => {
              setValues(nextValue);
            }}
            onReset={() => setValues(profile)}
            onSubmit={updateProfile}
            validate="submit"
          >
            <FormField
              name="city"
              label="Kiez or District in Berlin"
              margin={textMargin}
              required
            >
              <TextInput name="city" placeholder="Wedding" />
            </FormField>

            <FormField
              label="About your Studio"
              name="textStudio"
              margin={fieldMargin}
            >
              <TextArea
                name="textStudio"
                placeholder="Tell us a bit about your studio practice.
Describe the role it plays in your practice, how it affects your practice, and about the relationship(s) you have with it."
                fill
                maxLength={1200}
                rows={8}
              />
            </FormField>
            <br />
            <Heading level="3" size="medium" margin={fieldMargin}>
              Private Visits
            </Heading>
            <Row>
              <Col xs={12} md={8}>
                <Calendar
                  onSelect={onChangeDate}
                  dates={[calendarDate]}
                  size="medium"
                  daysOfWeek={true}
                  firstDayOfWeek={1}
                  // margin="medium"
                  bounds={[calendarBounds.Start, calendarBounds.End]}
                  // disabled={disabledDates}
                  // to customize the header
                  // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
                />
              </Col>
              <Col xs={12} md={4}>
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
              </Col>
            </Row>

            {/* 
            <Text>
              <b>
                We will only share your address with visitors after you agree to
                host them
              </b>
            </Text>

            
            <FormField
              name="address"
              label="Address (required)"
              margin={fieldMargin}
              required
            >
              <TextInput placeholder="" />
              <TextArea
                name="address"
                placeholder="Your address"
                fill
                rows={2}
                maxLength={200}
              // disabled
              />
            </FormField> 
            <FormField
              label="Tips on finding the studio"
              name="directions"
              margin={fieldMargin}
            >
              <TextArea
                name="directions"
                placeholder="Any extra helpful directions of how to arrive to your studio. How to find the right entrance or name on doorbell, etc ..."
                fill
                rows={4}
                maxLength={500}
              />
            </FormField>
            */}

            <Box>
              <Heading level="4" size="medium" margin={textMargin}>
                General visit tips
              </Heading>
              <ul>
                <li>Show up on time</li>
                <li>Ask before taking photos of the artist and artworks</li>
                <li>A gift is almost always a nice touch</li>
              </ul>
            </Box>

            <FormField
              label="Your visit rules"
              name="visitRules"
              margin={fieldMargin}
            >
              <TextArea
                name="visitRules"
                placeholder="What do you expect from visitors at your studio?
ex: My Rule 1; My Rule 2  (semi-colon seperated) "
                fill
                rows={4}
                maxLength={500}
              />
            </FormField>

            <br />
            <Heading level="3" size="medium" margin={fieldMargin}>
              Events
            </Heading>

            <Box margin={fieldMargin}>
              <Text>
                If you want to host a public event like an open studio, mini
                exhibition or workshop, you can add it here. Please include the
                event's title, date and a short description using the following
                format: <br />
                <b> Event title / Event dates(s) / Event description </b>
              </Text>
            </Box>

            <FormField label="Your events" name="events" margin={fieldMargin}>
              <TextArea
                name="events"
                placeholder="e.g. Painting workshop / 20 May 6-8pm / It's workshop for beginners "
                fill
                maxLength={1200}
                rows={4}
              />
            </FormField>
            <Box margin={textMargin}>
              <Text>
                How can visitors or participants can contact you and RSVP for
                the event if needed?
              </Text>
            </Box>

            <FormField
              name="eventsContact"
              label="Contact channel for event"
              margin={fieldMargin}
            >
              <TextInput
                name="eventsContact"
                placeholder="e.g. your email or instagram link. This will be shown publicly on your profile."
              />
            </FormField>
            <br />
            <br />
            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={loading}>
                Update
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
