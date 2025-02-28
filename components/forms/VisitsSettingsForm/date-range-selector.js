import { useState } from "react";
import moment from "moment";
import { Box, Button, Form, Calendar, Text } from "grommet";
import { Add, Save } from "grommet-icons";

import { Calendar as CalendarIcon, Trash, Plus } from "react-feather";

import {
  toIsoDate,
  toReverseIsoDate,
} from "services/helpers/parseAvailability";

export default function DateRangeSelector({ unavailableDates = [], onUpdate }) {
  // to DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatToRow = (dates) =>
    dates.map((r) => {
      return {
        id: Math.random().toString(),
        startDate: toIsoDate(r[0]),
        endDate: toIsoDate(r[1]),
        isSaved: true,
      };
    });

  const formatToDateRanges = (rows) =>
    rows
      .filter((r) => r.isSaved)
      .map((r) => {
        const startDate = r.startDate.includes("T")
          ? r.startDate.split("T")[0]
          : r.startDate;
        const endDate = r.endDate.includes("T")
          ? r.endDate.split("T")[0]
          : r.endDate;
        return [toReverseIsoDate(startDate), toReverseIsoDate(endDate)];
      });

  const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMMM");
  const readableDatewithYear = (date) =>
    moment(date, "YYYY-MM-DD").format("D MMMM, YYYY");

  const [rows, setRows] = useState([...formatToRow(unavailableDates)]);
  const [disableAddButton, setDisableAddButton] = useState(false);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        startDate: "",
        endDate: "",
        isSaved: false,
      },
    ]);
    setDisableAddButton(true);
  };

  const removeRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);

    onUpdate({
      unavailableDates: formatToDateRanges(newRows),
    });
    setDisableAddButton(false);
  };

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, [field]: value, isSaved: false } : range
      )
    );
  };

  const saveRow = (id) => {
    const newRows = rows.map((row) =>
      row.id === id ? { ...row, isSaved: true } : row
    );
    setRows(newRows);

    onUpdate({
      unavailableDates: formatToDateRanges(newRows),
    });
    setDisableAddButton(false);
  };

  return (
    <Box
      pad={{ horizontal: "none", vertical: "large" }}
      gap="medium"
      width={{ max: "900px" }}
      align="start"
    >
      <Form>
        {rows.map((row) => (
          <Box key={row.id} pad="xsmall">
            {row.isSaved ? (
              <Box
                pad={{ horizontal: "none", vertical: "small" }}
                direction="row"
                gap="large"
              >
                <Box basis="full" direction="row" gap="small">
                  <CalendarIcon size={20} />
                  <Text>
                    From {readableDate(row.startDate)} to{" "}
                    {readableDatewithYear(row.endDate)}
                  </Text>
                </Box>
                <Box align="end">
                  <Button
                    size="small"
                    color="brand"
                    icon={<Trash />}
                    onClick={() => removeRow(row.id)}
                    plain
                    hoverIndicator
                  />
                </Box>
              </Box>
            ) : (
              <Box
                direction="row"
                gap="large"
                align="start"
                pad="xsmall"
                background={
                  row.isSaved
                    ? { color: "light-1", opacity: "weak" }
                    : undefined
                }
              >
                <Box basis="1/2">
                  <Calendar
                    date={row.startDate}
                    onSelect={(date) => updateRow(row.id, "startDate", date)}
                    disabled={row.isSaved}
                    bounds={["2025-01-01", "2026-12-31"]}
                    size="small"
                  />
                </Box>

                <Box basis="1/2">
                  <Calendar
                    date={row.endDate}
                    onSelect={(date) => updateRow(row.id, "endDate", date)}
                    disabled={row.isSaved || !row.startDate}
                    bounds={[row.startDate || "2025-01-01", "2026-12-31"]}
                    size="small"
                  />
                </Box>

                <Box basis="10%" gap="small" align="start">
                  <Button
                    size="medium"
                    icon={<Plus />}
                    onClick={() => saveRow(row.id)}
                    primary
                    disabled={!row.startDate || !row.endDate}
                  />
                  <br />
                  <Button
                    margin={"small"}
                    size="small"
                    color="brand"
                    icon={<Trash />}
                    onClick={() => removeRow(row.id)}
                    plain
                    hoverIndicator
                  />
                </Box>
              </Box>
            )}
          </Box>
        ))}
        <Box margin={{ top: "medium" }} size="medium" align="start">
          <Button
            color="dark-3"
            icon={<Add color="dark-3" />}
            label="Add a date range"
            onClick={addRow}
            secondary
            disabled={disableAddButton}
          />
        </Box>
      </Form>
    </Box>
  );
}
