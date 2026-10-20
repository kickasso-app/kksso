"use client";

import React, { useState } from "react";
import moment from "moment";
import { Box, Calendar, DropButton, Text } from "grommet";
import { Calendar as CalendarIcon } from "react-feather";

import { OPENCALL_DATES } from "config/opencalldates";

// Grommet's Calendar works with ISO timestamps; the form stores plain YYYY-MM-DD.
// Local midnight keeps the bounds and the picked day on the same calendar day in any timezone.
const toIso = (date) => moment(date, "YYYY-MM-DD").toISOString();

// Calendar-only date picker (no typing). Value in and out is YYYY-MM-DD.
export default function DatePicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);

  const select = (picked) => {
    const day = Array.isArray(picked) ? picked[0] : picked;
    onChange(day ? moment(day).format("YYYY-MM-DD") : "");
    setOpen(false);
  };

  return (
    <DropButton
      id={id}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      dropAlign={{ top: "bottom", left: "left" }}
      dropContent={
        <Box pad="medium">
          <Calendar
            date={value ? toIso(value) : undefined}
            reference={toIso(value || OPENCALL_DATES.start)}
            bounds={[toIso(OPENCALL_DATES.start), toIso(OPENCALL_DATES.end)]}
            firstDayOfWeek={1}
            onSelect={select}
          />
        </Box>
      }
    >
      <Box direction="row" justify="between" align="center" gap="small" pad="small" fill>
        <Text color={value ? undefined : "text-weak"}>
          {value ? moment(value, "YYYY-MM-DD").format("dddd D MMM YYYY") : "Select a date"}
        </Text>
        <CalendarIcon size={18} />
      </Box>
    </DropButton>
  );
}
