import { useState } from "react";
import { moment } from "moment";
import { Box, Button, Form, Calendar, Text } from "grommet";
import { Add, Save } from "grommet-icons";

import { Calendar as CalendarIcon, Trash, Plus } from "react-feather";

export default function DateRangeSelector() {
  const [rows, setRows] = useState([]);

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
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((range) => range.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, [field]: value, isSaved: false } : range
      )
    );
  };

  const saveRow = (id) => {
    setRows((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, isSaved: true } : range
      )
    );
    console.log(
      "Range saved:",
      rows.find((range) => range.id === id)
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
                    From {formatDate(row.startDate)} to{" "}
                    {formatDate(row.endDate)}
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

                <Box basis="10%" direction="row" gap="medium" align="start">
                  <Button
                    size="medium"
                    icon={<Plus />}
                    onClick={() => saveRow(row.id)}
                    primary
                    disabled={!row.startDate || !row.endDate}
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
          />
        </Box>
      </Form>
    </Box>
  );
}
