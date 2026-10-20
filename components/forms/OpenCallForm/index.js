"use client";

import React from "react";
import moment from "moment";
import { Grid } from "react-flexbox-grid/dist/react-flexbox-grid";
import {
  Box,
  Heading,
  Text,
  Form,
  FormField,
  TextInput,
  TextArea,
  Select,
  FileInput,
  Image,
} from "grommet";

import Button from "components/Button";
import DatePicker from "./DatePicker";
import { COUNTRIES } from "config/constants/countries";
import { EVENT_TYPES } from "config/constants/eventTypes";
import { OPENCALL_DATES, isWithinOpenCallDates } from "config/opencalldates";

const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMM YYYY");

const fieldMargin = { vertical: "large" };
const textMargin = { bottom: "medium" };

const SectionTitle = ({ children }) => (
  <Heading level="3" size="medium" margin={{ top: "xlarge", bottom: "none" }}>
    {children}
  </Heading>
);

// Shared by the open call page (new submission) and the update page (edit).
export default function OpenCallForm({
  values,
  setValues,
  onSubmit,
  onPhotoChange,
  submitting,
  submitLabel = "Submit",
  isEdit = false,
  currentPhotoUrl,
}) {
  return (
    <Grid fluid>
      <Form
        value={values}
        onChange={setValues}
        onSubmit={onSubmit}
        validate="submit"
      >
        <SectionTitle>About you</SectionTitle>
        <FormField label="Your Name" name="host_name" margin={fieldMargin}>
          <TextInput name="host_name" maxLength={100} required />
        </FormField>
        {/* The email cannot be changed after submitting, so it is not shown when editing */}
        {!isEdit && (
          <FormField label="Your Email" name="host_email" margin={fieldMargin}>
            <TextInput
              name="host_email"
              type="email"
              maxLength={200}
              required
            />
          </FormField>
        )}
        <FormField label="Country" name="country" margin={fieldMargin}>
          <Select
            name="country"
            options={COUNTRIES}
            placeholder="Select country"
            value={values.country}
            onChange={({ option }) =>
              setValues((prev) => ({ ...prev, country: option }))
            }
            required
          />
        </FormField>
        <FormField label="City" name="city" margin={fieldMargin}>
          <TextInput
            name="city"
            placeholder="e.g Berlin"
            maxLength={100}
            required
          />
        </FormField>
        <FormField
          label="Instagram or Website"
          name="link"
          margin={fieldMargin}
        >
          <TextInput
            name="link"
            placeholder="@yourhandle or https://your-site.com"
            maxLength={300}
            required
          />
        </FormField>

        <SectionTitle>The event</SectionTitle>
        <FormField label="Event Title" name="title" margin={fieldMargin}>
          <TextInput
            name="title"
            placeholder="Enter event title"
            maxLength={150}
            required
          />
        </FormField>
        <FormField label="Event Type" name="type" margin={fieldMargin}>
          <Select
            name="type"
            options={EVENT_TYPES}
            value={values.type}
            onChange={({ option }) =>
              setValues((prev) => ({
                ...prev,
                type: option,
                typeOther: option !== "Other" ? "" : prev.typeOther,
              }))
            }
            required
          />
        </FormField>
        {values.type === "Other" && (
          <FormField
            label="Specify Event Type"
            name="typeOther"
            margin={fieldMargin}
          >
            <TextInput name="typeOther" maxLength={50} required />
          </FormField>
        )}

        <Box margin={textMargin}>
          <Heading level="4" size="medium" margin={{ bottom: "small" }}>
            Event Photo
          </Heading>
          <Text>
            We suggest a square ratio (1:1) for this image. <br />
            Please make sure that your image file is smaller than <b>2 MB</b>
            {currentPhotoUrl && (
              <>
                <br />
                Choose a new photo only if you want to replace the current one.
              </>
            )}
          </Text>
        </Box>
        {currentPhotoUrl && (
          <Box margin={{ bottom: "medium" }}>
            <Image src={currentPhotoUrl} alt="Current event photo" height="200px" fit="contain" />
          </Box>
        )}
        <Box margin={{ bottom: "medium" }}>
          <FileInput
            name="photo"
            multiple={false}
            accept="image/*"
            disabled={submitting}
            onChange={onPhotoChange}
          />
        </Box>

        <FormField
          label="Short Description"
          name="miniDescription"
          margin={fieldMargin}
        >
          <TextArea
            name="miniDescription"
            placeholder="A brief event description"
            maxLength={300}
            rows={4}
            required
          />
        </FormField>
        <FormField
          label="Long Description"
          name="longDescription"
          margin={fieldMargin}
        >
          <TextArea
            name="longDescription"
            placeholder="Tell us about your evening: what you will show of your process and what guests can expect"
            maxLength={2000}
            rows={14}
            required
          />
        </FormField>
        <FormField label="Languages" name="languages" margin={fieldMargin}>
          <TextInput
            name="languages"
            placeholder="English, Arabic, ..."
            maxLength={100}
          />
        </FormField>

        <SectionTitle>When and where</SectionTitle>
        <FormField
          label="Event Date"
          name="date"
          margin={fieldMargin}
          required
          validate={(date) =>
            /^\d{4}-\d{2}-\d{2}$/.test(date) && isWithinOpenCallDates(date)
              ? undefined
              : `Pick a date between ${readableDate(OPENCALL_DATES.start)} and ${readableDate(OPENCALL_DATES.end)}`
          }
        >
          <DatePicker
            id="date"
            value={values.date}
            onChange={(date) => setValues((prev) => ({ ...prev, date }))}
          />
        </FormField>
        <FormField label="Event Time" name="time" margin={fieldMargin}>
          <TextInput
            name="time"
            placeholder="e.g. 6-9 pm"
            maxLength={50}
            required
          />
        </FormField>
        <FormField label="Location" name="location" margin={fieldMargin}>
          <TextInput
            name="location"
            placeholder="Address"
            maxLength={200}
            required
          />
        </FormField>

        {/* Honeypot: hidden from people, bots tend to fill it in */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, website: e.target.value }))
            }
          />
        </div>

        <Box direction="row" gap="medium" margin={{ bottom: "xlarge" }}>
          <Button type="submit" btnStyle="filled" disabled={submitting}>
            {submitting ? "Submitting..." : submitLabel}
          </Button>
        </Box>
      </Form>
    </Grid>
  );
}
