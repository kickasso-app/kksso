import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import moment from "moment";


import { useAuth } from "services/auth";

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

export default function VisitsSettingsForm({ profile: { visitRules, openDates, address } }) {
  const { user, session } = useAuth();


  const [values, setValues] = useState({ visitRules, openDates, address });

  const initialDates = openDates?.split(",") ?? [];

  const getSelectedTimes = (date, dates) => {
    const timeData = dates.filter(s => s.startsWith(date)).map(d => d.split(" ")[1]);
    return timeData;

  }

  const [selectedDate, setSelectedDate] = useState(calendarBounds.Start);
  const [selectedTimes, setSelectedTimes] = useState(getSelectedTimes(calendarBounds.Start, initialDates));
  const [visitSlots, setVisitSlots] = useState(initialDates);


  const onChangeTimes = (times) => {
    setSelectedTimes(times);
  }

  const onChangeDate = (date) => {

    updateTempSlots();

    setSelectedDate(date);
    setSelectedTimes(getSelectedTimes(date, visitSlots));

  }

  const updateTempSlots = () => {
    console.log(selectedDate);
    console.log(selectedTimes);

    // remove old times
    // then add new ones
    const oldTimes = initialDates.filter(s => !s.startsWith(selectedDate));

    selectedTimes.forEach(t => oldTimes.push(selectedDate + " " + t));


    const newTimes = oldTimes.filter(t => t.length > 2);
    setVisitSlots(newTimes);

    return newTimes;

  }


  const readableDate = (calendarDate) => moment(calendarDate, "YYYY-MM-DD hh:mm").format("D MMMM");


  // const disabledDates = [["2023-09-01", "2023-09-15"]];


  // TO DO: get address from separate table with more security


  const [loading, setLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);



  async function updateProfile(event) {

    const newOpenDates = updateTempSlots();


    try {
      setIsUpdateError(false);
      setIsUpdateSuccess(false);
      setLoading(true);




      const updates = {
        ...values,
        openDates: newOpenDates.join(","),
        // updated_at: new Date(),
      };

      // console.log("updates");
      // console.log(updates);

      let { error } = await supabase
        .from("studios")
        .update(updates, { returning: "minimal" })
        .eq("uuid", user.id);

      if (error) {
        setIsUpdateError(true);
        throw error;
      } else {
        setIsUpdateSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
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
              label="Your Visit Rules"
              name="visitRules"
              margin={fieldMargin}
            >
              <TextArea
                name="visitRules"
                placeholder="What do you expect from visitors at your studio?"
                fill
                rows={6}
                maxLength={500}
              />
            </FormField>

            <FormField
              name="address"
              label="Address (required if your studio is open for visits)"
              margin={fieldMargin}
              required
            >
              <Text>
                <b>
                  We will only share your address with visitors after you
                  agree to host them
                </b>
              </Text>
              <TextInput placeholder="" />
              <TextArea
                name="address"
                placeholder="Your address"
                fill
                rows={3}
                maxLength={200}
                disabled
              />
            </FormField>

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
                    <br /><br />
                  </b>

                  <CheckBoxGroup

                    value={selectedTimes}
                    onChange={({ value: nextValue }) => {
                      onChangeTimes(nextValue);
                    }}
                    options={[
                      '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
                    ]}
                  />


                </Text>
              </Col>
            </Row>

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
    </Box >
  );
}
