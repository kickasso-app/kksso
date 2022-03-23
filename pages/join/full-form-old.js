import React, { useState, useEffect } from "react";

import * as emailjs from "emailjs-com";

import { CheckCircle, XCircle } from "react-feather";

import {
  Box,
  Form,
  FormField,
  MaskedInput,
  CheckBoxGroup,
  TextArea,
  TextInput,
  Text,
  Heading,
  Grommet,
} from "grommet";

import Button from "components/Button";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

const Join = () => {
  const [values, setValues] = useState({
    requestor_email: "Requestor email",
    from_name: "Requestor Name",
    about: "Hello There Message",
    city: "Berlin",
    mediums: "",
    types: "1",
    portfolio: "",
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sendEmailError, setSendEmailError] = useState(false);
  // Remove in Production
  const sendingRealEmail = false;

  useEffect(() => {
    emailjs.init(USER_ID);
  }, []);

  const handleSendEmail = () => {
    var templateParams = values;
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

  const fieldMargin = { vertical: "medium" };
  const textMargin = { bottom: "medium" };

  return (
    <Box fill align="center" justify="center">
      <Box width="large" pad="medium">
        <Heading level="3" size="medium" margin={fieldMargin}>
          Welcome
        </Heading>
        <Text size="medium" margin={textMargin}>
          Add your info here and we will get back to you as soon as possible.
        </Text>
        <Grommet>
          {" "}
          <Form
            values={values}
            onChange={(nextValue) => {
              setValues(nextValue);
              // console.log("Change", nextValue);
            }}
            onReset={() =>
              setValues({
                requestor_email: "Requestor email",
                from_name: "Requestor Name",
                message: "Hello There Message",
              })
            }
            onSubmit={handleSendEmail}
            validate="submit"
          >
            <FormField
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
            </FormField>
            <FormField
              name="city"
              htmlfor="text-input-id"
              label="City"
              margin={fieldMargin}
              required
            >
              <TextInput id="text-input-id" name="city" placeholder="Berlin" />
            </FormField>

            <FormField
              name="mediums"
              htmlfor="text-input-id"
              label="Mediums used"
              required
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="mediums"
                placeholder="painting, prints, sound"
              />
            </FormField>

            <FormField
              name="types"
              label="How would you use your account?"
              margin={fieldMargin}
            >
              <CheckBoxGroup
                name="types"
                valueKey="id"
                required
                options={[
                  { label: "Artist", id: "1" },
                  { label: "Art Lover", id: "2" },
                  { label: "Collector", id: "3" },
                ]}
              />
            </FormField>

            <FormField label="Hello!" name="message" margin={fieldMargin}>
              <TextArea
                name="about"
                placeholder="Tell us about your artwork or collection, and your space or studio (required)"
                fill
                required
              />
            </FormField>

            <FormField
              name="portfolio"
              htmlfor="text-input-id"
              label="Portfolio"
              type="url"
              margin={fieldMargin}
            >
              <TextInput
                id="text-input-id"
                name="portfolio"
                placeholder="Link (optional)"
              />
            </FormField>
            <br />
            <Box direction="row" gap="medium">
              <Button type="submit" btnStyle="filled" disabled={isEmailSent}>
                Join
              </Button>

              <Button type="reset" btnStyle="outline">
                Clear
              </Button>
            </Box>

            {isEmailSent ? (
              <>
                <Text>
                  <CheckCircle size={24} color="#C0FFF4" strokeWidth={3} />
                  <br />
                  Thanks for joining!
                  <br /> Please check your email to confirm your account
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
        </Grommet>
      </Box>
    </Box>
  );
};

export default Join;
