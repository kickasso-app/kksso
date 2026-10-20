"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Heading, Text } from "grommet";

import OpenCallForm from "components/forms/OpenCallForm";
import {
  PHOTO_MAX_SIZE,
  emptyValues,
  buildPayload,
  uploadPhoto,
} from "components/forms/OpenCallForm/helpers";
import ToastNotification from "components/ToastNotification";
import { createSlug } from "services/helpers/textFormat";

export default function OpenCallClient() {
  const [values, setValues] = useState(emptyValues);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [notification, setNotification] = useState(null);

  const fieldMargin = { vertical: "large" };

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setPhoto(null);
    if (file.size > PHOTO_MAX_SIZE) {
      setPhoto(null);
      setNotification({
        warning: true,
        type: "Photo Upload",
        message: "Upload a smaller image, less than 2 Megabytes.",
      });
      return;
    }
    setPhoto(file);
  };

  async function handleSubmit() {
    if (!photo) {
      setNotification({
        warning: true,
        type: "Photo Upload",
        message: "Please add a photo for your event.",
      });
      return;
    }

    setSubmitting(true);
    setNotification(null);
    try {
      const response = await fetch("/api/create-opencall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(values)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      // Honeypot hit: server pretends success without creating anything.
      if (data.uploads) await uploadPhoto(data.uploads, photo);

      setSubmitted({
        email: values.host_email,
        country: values.country,
        emailSent: data.emailSent,
      });
    } catch (error) {
      console.error("Open call submission error:", error);
      setNotification({
        warning: true,
        type: "Submission",
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Box fill align="center" justify="center" pad="large" gap="medium">
        <Heading level="3" size="medium" textAlign="center">
          Thank you!
        </Heading>
        <Text textAlign="center">
          Your submission is in. We will review it and get back to you by email.
        </Text>
        <Text textAlign="center">
          {submitted.emailSent ? (
            <>
              We sent a confirmation email to <b>{submitted.email}</b>. If you
              do not see it, please check your spam folder.
            </>
          ) : (
            <>
              We could not send a confirmation email to{" "}
              <b>{submitted.email}</b>, but your submission was received. You
              can write to us at hello@arti.my if you have questions.
            </>
          )}
        </Text>
        <Text textAlign="center">
          While you wait, why not see what else is happening
          {submitted.country ? ` in ${submitted.country}` : ""}? Check out the{" "}
          <Link
            href={
              submitted.country
                ? `/events/${createSlug(submitted.country)}`
                : "/events"
            }
          >
            <b>upcoming events</b>
          </Link>{" "}
          on Arti.
        </Text>
        <Link href="/">Back to Homepage</Link>
      </Box>
    );
  }

  return (
    <Box fill align="center" justify="center">
      <Box fill="horizontal" pad="medium" gap="medium" width={{ max: "large" }}>
        <Heading level="3" size="medium" margin={fieldMargin}>
          Arti Night Open Call
        </Heading>
        <Text>
          Tell us about the evening you would like to host in your studio. We
          review every submission, and approved events are published on Arti.
          New to the format? Read about{" "}
          <Link href="/night">hosting an Arti Night</Link> first.
        </Text>

        <OpenCallForm
          values={values}
          setValues={setValues}
          onSubmit={handleSubmit}
          onPhotoChange={onPhotoChange}
          submitting={submitting}
        />

        {notification && (
          <ToastNotification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}
      </Box>
    </Box>
  );
}
