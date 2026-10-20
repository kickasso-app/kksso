import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Grommet } from "grommet";

import OpenCallForm from "components/forms/OpenCallForm";
import { emptyValues } from "components/forms/OpenCallForm/helpers";

jest.mock("services/supabase", () => ({ supabase: {} }));
jest.mock("services/images", () => ({ resizeImage: jest.fn() }));

const Harness = ({ initialDate = "", isEdit = false }) => {
  const [values, setValues] = useState({ ...emptyValues, date: initialDate });
  return (
    <Grommet>
      <OpenCallForm
        values={values}
        setValues={setValues}
        onSubmit={() => {}}
        onPhotoChange={() => {}}
        submitting={false}
        isEdit={isEdit}
      />
      <output data-testid="date">{values.date}</output>
    </Grommet>
  );
};

describe("OpenCallForm date field", () => {
  it("has no text input for the date", () => {
    render(<Harness />);
    expect(screen.queryByPlaceholderText("YYYY-MM-DD")).toBeNull();
    expect(screen.getByText("Select a date")).toBeInTheDocument();
  });

  it("shows a stored date in readable form", () => {
    render(<Harness initialDate="2026-12-01" />);
    expect(screen.getByText("Tuesday 1 Dec 2026")).toBeInTheDocument();
  });

  it("picks a day from the calendar and only allows days in range", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Select a date"));

    // Disabled days are marked with aria-disabled, not the disabled attribute
    const isOff = (b) => b.getAttribute("aria-disabled") === "true";
    const days = () => screen.getAllByRole("button").filter((b) => /^\d+$/.test(b.textContent));
    const day = (n) => days().filter((b) => b.textContent === String(n))[0];

    // November: the 14th is out of range, the 15th is the first allowed day
    expect(isOff(day(14))).toBe(true);
    expect(isOff(day(15))).toBe(false);

    // December: the 15th is the last allowed day, the 16th is out
    fireEvent.click(screen.getByLabelText(/December 2026/));
    const dec = days().filter((b) => b.getAttribute("aria-disabled") !== null);
    const decDay = (n) => dec.filter((b) => b.textContent === String(n)).pop();
    expect(isOff(decDay(15))).toBe(false);
    expect(isOff(decDay(16))).toBe(true);

  });

  it("stores the picked day as YYYY-MM-DD", () => {
    render(<Harness />);
    fireEvent.click(screen.getByText("Select a date"));
    const first20 = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "20");
    fireEvent.click(first20);
    expect(screen.getByTestId("date").textContent).toBe("2026-11-20");
    expect(screen.getByText("Friday 20 Nov 2026")).toBeInTheDocument();
  });

  it("asks for the email when submitting but not when editing", () => {
    const { unmount } = render(<Harness />);
    expect(screen.getByText("Your Email")).toBeInTheDocument();
    unmount();

    render(<Harness isEdit />);
    expect(screen.queryByText("Your Email")).toBeNull();
    expect(screen.getByText("Your Name")).toBeInTheDocument();
  });
});
