import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { useAuth } from "services/auth";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  Notification,
  CheckBoxGroup,
  Calendar,
  TextArea,
  TextInput,
  Text,
  Heading,
  Grommet,
} from "grommet";


import Button from "components/Button";

import { calendarBounds } from "config/calendar";

export default function VisitsSettingsForm({ profile: { visitRules, openDates, address } }) {
  const [values, setValues] = useState({ visitRules, openDates, address });

  // console.log(values);

  const [loading, setLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);

  const { user, session } = useAuth();


  const [selectedDate, setSelectedDate] = useState(calendarBounds.Start);


  const prepDates = (rawDate) => {
    const date = moment(rawDate, "DD/MM/YYYY hh:mm").format("YYYY-MM-DD hh:mm");
    return date;
  }

  // const readableDate = (calendarDate) => moment(calendarDate, "YYYY-MM-DD hh:mm").format("D MMMM - h:mm a");

  //  const calendarDates = values?.openDates?.map(d => prepDates(d)) || prepDates(calendarBounds.Start);


  const disabledDates = [["2023-09-01", "2023-09-15"]];


  // TO DO: get address from separate table with more security


  async function updateProfile(event) {
    console.log(event.touched);
    // console.log("Submit", event.value, event.touched);
    // console.log(values);
    try {
      setIsUpdateError(false);
      setIsUpdateSuccess(false);
      setLoading(true);

      const updates = {
        ...values,
        // updated_at: new Date(),
      };

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

  const onChangeDate = (date) => {
    console.log(date);
    setSelectedDate(date);
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
              //   console.log("Change", nextValue);
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
                  {"  "} We will only share your address with visitors after you
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
                  disabled={disabledDates}
                // to customize the header
                // https://storybook.grommet.io/?path=/story/visualizations-calendar-header--custom-header-calendar
                />

              </Col>
              <Col xs={12} md={4}>
                <Text>
                  <b>
                    hours

                    of {selectedDate}


                  </b>
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

{
  /* <FormField
              name="from_name"
              htmlfor="text-input-id"
              label="Name"
              required
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="from_name"
                placeholder="Name"
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
              margin={fieldMargin}
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
            </FormField> */
}
