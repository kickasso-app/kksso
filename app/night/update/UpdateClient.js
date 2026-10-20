"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Heading, Text } from "grommet";

import OpenCallForm from "components/forms/OpenCallForm";
import {
  PHOTO_MAX_SIZE,
  emptyValues,
  buildPayload,
  valuesFromEvent,
  uploadPhoto,
} from "components/forms/OpenCallForm/helpers";
import ToastNotification from "components/ToastNotification";
import { supabase } from "services/supabase";

const Message = ({ title, children }) => (
  <Box fill align="center" justify="center" pad="large" gap="medium">
    <Heading level="3" size="medium" textAlign="center">
      {title}
    </Heading>
    <Text textAlign="center">{children}</Text>
    <Link href="/night">Back to Arti Night</Link>
  </Box>
);

export default function UpdateClient() {
  const edittoken = useSearchParams().get("edittoken");

  const [status, setStatus] = useState("loading"); // loading | notfound | ready | saved
  const [values, setValues] = useState(emptyValues);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wasPublished, setWasPublished] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!edittoken) return setStatus("notfound");

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(
          `/api/update-opencall?edittoken=${encodeURIComponent(edittoken)}`
        );
        if (!response.ok) throw new Error("Submission not found");
        const { event } = await response.json();
        if (cancelled) return;

        setValues(valuesFromEvent(event));
        setWasPublished(!!event.isPublished);
        const { data } = supabase.storage
          .from("events")
          .getPublicUrl(`${event.studio_uuid}/${event.id}/event-small.jpg`);
        setPhotoUrl(`${data.publicUrl}?t=${Date.now()}`);
        setStatus("ready");
      } catch (error) {
        if (!cancelled) setStatus("notfound");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [edittoken]);

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
    setSubmitting(true);
    setNotification(null);
    try {
      const response = await fetch("/api/update-opencall", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buildPayload(values),
          edittoken,
          replacePhoto: !!photo,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      if (data.uploads && photo) await uploadPhoto(data.uploads, photo);
      setWasPublished(data.wasPublished);
      setStatus("saved");
    } catch (error) {
      console.error("Open call update error:", error);
      setNotification({
        warning: true,
        type: "Update",
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return <Message title="Loading...">One moment please.</Message>;
  }

  if (status === "notfound") {
    return (
      <Message title="Submission not found">
        This edit link is not valid. Please use the private link from your
        confirmation email, or write to us at hello@arti.my.
      </Message>
    );
  }

  if (status === "saved") {
    return (
      <Message title="Changes saved">
        {wasPublished
          ? "Your event has been updated and the changes are live."
          : "Thank you! Your changes are saved. We will review your submission and get back to you by email."}
      </Message>
    );
  }

  return (
    <Box fill align="center" justify="center">
      <Box fill="horizontal" pad="medium" gap="medium" width={{ max: "large" }}>
        <Heading level="3" size="medium" margin={{ vertical: "large" }}>
          Edit your Arti Night submission
        </Heading>
        <Text>
          Update your details below.{" "}
          {wasPublished
            ? "Your changes go live as soon as you save."
            : "Your submission is still waiting for approval, and your changes are saved for our review."}
        </Text>

        <OpenCallForm
          values={values}
          setValues={setValues}
          onSubmit={handleSubmit}
          onPhotoChange={onPhotoChange}
          submitting={submitting}
          submitLabel="Save changes"
          isEdit
          currentPhotoUrl={photoUrl}
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
