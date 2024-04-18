import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

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
    // address,
    // directions,
  },
}) {
  const { user } = useAuth();
  const { updateAccount, loading, isUpdateSuccess, isUpdateError } =
    useAccount();

  const [values, setValues] = useState({
    visitRules,
    openDates,
    city,
    textStudio,
    // directions,
    // address,
  });

  const getSelectedTimes = (date, dates) => {
    const timeData = dates
      .filter((s) => s.startsWith(date))
      .map((d) => d.split(" ")[1]);
    return timeData;
  };

  useEffect(() => {
    if (openDates?.length > 0) {
      const tempDates = openDates;
      const tempTimes = getSelectedTimes(calendarBounds.Start, tempDates);

      setSelectedTimes(tempTimes);
      setInitialDates(tempDates);
      setVisitSlots(tempDates);
      // console.log("once");
    }
  }, [openDates]);

  const [initialDates, setInitialDates] = useState([]);
  const [visitSlots, setVisitSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState(calendarBounds.Start);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const onChangeTimes = (times) => {
    setSelectedTimes(times);
  };

  const onChangeDate = (date) => {
    updateTempSlots();

    setSelectedDate(date);
    setSelectedTimes(getSelectedTimes(date, visitSlots));
  };

  const updateTempSlots = () => {
    console.log(selectedDate);
    console.log(selectedTimes);

    // remove old times
    // then add new ones
    const oldTimes = initialDates.filter((s) => !s.startsWith(selectedDate));

    selectedTimes.forEach((t) => oldTimes.push(selectedDate + " " + t));

    const newTimes = oldTimes.filter((t) => t.length > 2);
    setVisitSlots(newTimes);

    return newTimes;
  };

  const readableDate = (date) =>
    moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  // const disabledDates = [["2023-09-01", "2023-09-15"]];

  async function updateProfile(event) {
    const newOpenDates = updateTempSlots();

    const updates = {
      ...values,
      openDates: newOpenDates,
      // updated_at: new Date(),
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
            <Row>
              <Col xs={12} md={8}>
                <Calendar
                  onSelect={onChangeDate}
                  dates={[selectedDate]}
                  size="medium"
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
                    {readableDate(selectedDate)}
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

            <FormField
              name="city"
              label="District in Berlin"
              margin={fieldMargin}
              required
            >
              <TextInput name="city" placeholder="Wedding" />
            </FormField>

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

            <FormField
              label="About your Studio"
              name="textStudio"
              margin={fieldMargin}
            >
              <TextArea
                name="textStudio"
                placeholder="Tell us about your space or studio"
                fill
                maxLength={1200}
                rows={8}
              />
            </FormField>

            <Box>
              <Heading level="4" size="medium" margin={textMargin}>
                General Visit Tips
              </Heading>
              <ul>
                <li>Show up on time</li>
                <li>Ask before taking photos of the artist and artworks</li>
                <li>A gift is almost always a nice touch</li>
              </ul>
            </Box>

            <FormField
              label="Your Visit Rules"
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
