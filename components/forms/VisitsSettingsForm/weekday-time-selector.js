import { useState } from "react";
import { Box, Button, Form, Select, Text } from "grommet";
import { Clock, Trash, Plus } from "react-feather";

export default function WeekdayTimeSelector() {
  const [rows, setRows] = useState([
    {
      id: "1",
      weekdays: [],
      selectedHours: [],
      isSaved: false,
    },
  ]);

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  });

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        weekdays: [],
        selectedHours: [],
        isSaved: false,
      },
    ]);
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value, isSaved: false } : row
      )
    );
  };

  const saveRow = (id) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, isSaved: true } : row))
    );
    console.log(
      "Row saved:",
      rows.find((row) => row.id === id)
    );
    addRow();
  };

  return (
    <Box
      pad={{ horizontial: "none", vertical: "large" }}
      gap="medium"
      // width={{ max: "900px" }}
      align="start"
    >
      <Form>
        {rows.map((row) => (
          <Box key={row.id}>
            {row.isSaved && (
              <Box
                pad={{ horizontial: "xsmall", vertical: "small" }}
                direction="row"
                gap="small"
              >
                <Clock size={20} />
                <Text>
                  {"Every "}
                  {row.weekdays.join(", ")} at {row.selectedHours.join(", ")}
                </Text>
              </Box>
            )}
            <Box
              direction="row"
              gap="small"
              align="start"
              pad="xsmall"
              background={
                row.isSaved ? { color: "light-1", opacity: "weak" } : undefined
              }
            >
              <Box basis="1/2">
                {/* {row.weekdays?.length > 1 && (
                <>
                  {row.weekdays.join(", ")}
                  <br />
                </>
              )} */}
                <Select
                  multiple
                  options={weekdays}
                  value={row.weekdays}
                  onChange={({ value }) => updateRow(row.id, "weekdays", value)}
                  placeholder="Choose weekdays"
                  closeOnChange={false}
                  disabled={row.isSaved}
                />
              </Box>

              <Box basis="1/2">
                <Select
                  multiple
                  options={hours}
                  value={row.selectedHours}
                  onChange={({ value }) =>
                    updateRow(row.id, "selectedHours", value)
                  }
                  placeholder="Select hours"
                  closeOnChange={false}
                  disabled={row.isSaved}
                  showSelectedInline
                />
              </Box>

              <Box basis="10%" direction="row" gap="medium" align="start">
                {!row.isSaved ? (
                  <Button
                    size="medium"
                    icon={<Plus />}
                    onClick={() => saveRow(row.id)}
                    primary
                    disabled={
                      row.weekdays.length === 0 ||
                      row.selectedHours.length === 0
                    }
                  />
                ) : (
                  <Box pad="small">
                    <Button
                      size="small"
                      color="brand"
                      icon={<Trash />}
                      onClick={() => removeRow(row.id)}
                      plain
                      hoverIndicator
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Form>
    </Box>
  );
}
