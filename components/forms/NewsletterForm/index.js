import { useState, useContext } from "react";

import { createContact } from "services/contacts";
import { sendEmail } from "services/sendEmail";

import {
  Box,
  Heading,
  Text,
  FormField,
  TextInput,
  CheckBox,
  ResponsiveContext,
  Grid,
  Button as GrommetButton,
} from "grommet";
import Button from "components/Button";

const contactTypeOptions = ["Artist", "Art Lover", "Collector", "Curator"];

export default function NewsletterForm({ profile }) {
  const size = useContext(ResponsiveContext);

  const [formValues, setFormValues] = useState({
    email: "",
    contactType: [],
    city: "",
  });

  const [addingToNews, setAddingToNews] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const fieldMargin = { vertical: "medium" };

  const addToNewsletter = async (event) => {
    event.preventDefault();
    const { email, city, contactType } = formValues;
    // console.log(toEmail, city, contactType);
    try {
      setAddingToNews(true);

      const isContactCreated = await createContact({
        newNewsletter: {
          email: email,
          city: city,
          contact_type: contactType,
        },
      });

      if (!isContactCreated) {
        throw new Error(`Adding email to newsletter failed.`);
      }

      const emailDetails = {
        subject: "Arti Newsletter: Thanks for subscribing!",
        toEmail: email,
        fromEmail: "default",
      };

      const { emailSent, error } = await sendEmail({
        emailTemplate: "newsletterTemplate",
        emailDetails,
        emailVariables: { city: city },
      });

      if (emailSent && isContactCreated) {
        setIsAddedSuccess(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setAddingToNews(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormValues((prevValues) => {
      let updatedContactType = [...prevValues.contactType];
      if (checked) {
        updatedContactType.push(name); // Add the checkbox value
      } else {
        updatedContactType = updatedContactType.filter((item) => item !== name); // Remove the checkbox value
      }
      return {
        ...prevValues,
        contactType: updatedContactType,
      };
    });
  };

  return (
    <Box fill align="center" pad="small">
      {isAddedSuccess ? (
        <Text weight="bold" pad="small" margin={{ top: "xlarge" }}>
          Thank you! You subscribed succesfully.
        </Text>
      ) : (
        <Box width={["100%", "medium"]} direction="column" fill>
          <form onSubmit={addToNewsletter}>
            <FormField
              name="email"
              label="Email *"
              margin={fieldMargin}
              required
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
            </FormField>
            <FormField
              name="contactType"
              label="Contact Type"
              margin={fieldMargin}
              required
            >
              <Grid
                fill
                columns={size === "small" ? "1/2" : "1/4"} // 2 columns on small, 4 on larger
                rows={["auto"]}
                gap="small"
              >
                {contactTypeOptions.map((option) => (
                  <Box key={option} pad="small">
                    <CheckBox
                      key={option}
                      label={option}
                      name={option}
                      checked={formValues.contactType.includes(option)}
                      onChange={handleCheckboxChange}
                    />
                  </Box>
                ))}
              </Grid>
            </FormField>

            <FormField name="city" label="City" margin={fieldMargin}>
              <TextInput
                id="city"
                name="city"
                placeholder="City"
                value={formValues.city}
                onChange={handleChange}
              />
            </FormField>
            <Box
              margin={{ top: "large" }}
              width={size === "small" ? "large" : "medium"}
            >
              <Button
                type="submit"
                btnStyle="outline"
                disabled={addToNewsletter}
              >
                {addingToNews ? "Subscribing ..." : "Subscribe to newsletter"}
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
}
