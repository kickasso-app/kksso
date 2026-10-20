// Columns safe to expose to the public. Never use select("*") on events:
// host_email is private (open call submitter) and is revoked from anon/authenticated.
export const EVENT_COLUMNS = {
  ALL: [
    "id",
    "studio_uuid",
    "title",
    "type",
    "date",
    "time",
    "location",
    "city",
    "country",
    "miniDescription",
    "longDescription",
    "currentNJoined",
    "maxNJoined",
    "contact",
    "link",
    "languages",
    "fee",
    "txtDirection",
    "isPublished",
    "isWithoutRegistration",
    "host_name",
    "source",
    "created_at",
  ].join(","),
};
