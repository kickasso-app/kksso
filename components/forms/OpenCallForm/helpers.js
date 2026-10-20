import { supabase } from "services/supabase";
import { resizeImage } from "services/images";
import { EVENT_TYPES } from "config/constants/eventTypes";

export const PHOTO_MAX_SIZE = 2097152; // 2 MB

export const emptyValues = {
  host_name: "",
  host_email: "",
  title: "",
  type: "Arti Night",
  typeOther: "",
  date: "",
  time: "",
  city: "",
  country: "",
  location: "",
  languages: "",
  miniDescription: "",
  longDescription: "",
  link: "",
  website: "", // honeypot, must stay empty
};

// Form values -> API payload (the "Other" type text replaces the type).
export const buildPayload = (values) => {
  const payload = {
    ...values,
    type: values.type === "Other" ? values.typeOther : values.type,
  };
  delete payload.typeOther;
  return payload;
};

// Stored event -> form values.
export const valuesFromEvent = (event) => {
  const isListedType = EVENT_TYPES.includes(event.type);
  return {
    host_name: event.host_name ?? "",
    host_email: event.host_email ?? "",
    title: event.title ?? "",
    type: isListedType ? event.type : "Other",
    typeOther: isListedType ? "" : event.type ?? "",
    date: event.date ?? "",
    time: event.time ?? "",
    city: event.city ?? "",
    country: event.country ?? "",
    location: event.location ?? "",
    languages: event.languages ?? "",
    miniDescription: event.miniDescription ?? "",
    longDescription: event.longDescription ?? "",
    link: event.link ?? "",
    website: "",
  };
};

// Resizes the photo and uploads both sizes with the signed URLs from the API.
export const uploadPhoto = async (uploads, photo) => {
  const [fileLarge, fileSmall] = await resizeImage({
    file: photo,
    returnSmallerImage: true,
  });
  const files = { "event-large.jpg": fileLarge, "event-small.jpg": fileSmall };
  for (const [name, { path, token }] of Object.entries(uploads)) {
    const { error } = await supabase.storage
      .from("events")
      .uploadToSignedUrl(path, token, files[name]);
    if (error) throw error;
  }
};
