import {
  parseAvailability,
  getFirstAvailableDate,
  isDateUnavailable,
  getClosedDates,
  dateUtils,
  toIsoDate,
  toReverseIsoDate,
} from "services/helpers/parseAvailability";

import moment from "moment";

// Mock moment to control dates in tests
jest.mock("moment", () => {
  const actualMoment = jest.requireActual("moment");
  const MOCK_CURRENT_ISO_STRING = "2026-03-11T12:00:00.000Z"; // Matches MOCK_CURRENT_DATE

  const momentMock = (input, format) => {
    if (input === undefined) {
      // If no input, return a moment object for the mock date
      return actualMoment(MOCK_CURRENT_ISO_STRING);
    } else if (typeof input === "string" && format) {
      // If format is provided, use actual moment for parsing
      return actualMoment(input, format);
    }
    // Otherwise, use actual moment constructor behavior
    return actualMoment(input);
  };

  Object.assign(momentMock, actualMoment); // Copy static methods like moment.utc
  return momentMock;
});

// Mock Date to control "today" in tests for consistency
const MOCK_CURRENT_DATE = new Date("2026-03-11T12:00:00.000Z"); // Mid-March 2026
const RealDate = Date;

// global.Date = class extends RealDate {
//   constructor(dateString) {
//     if (dateString) {
//       return new RealDate(dateString);
//     }
//     return new RealDate(MOCK_CURRENT_DATE);
//   }
//   static now() {
//     return MOCK_CURRENT_DATE.getTime();
//   }
// };

describe("parseAvailability utility functions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("toIsoDate", () => {
    it("should convert DD/MM/YYYY to YYYY-MM-DD", () => {
      expect(toIsoDate("01/01/2026")).toBe("2026-01-01");
    });
    it("should handle single digit day/month correctly", () => {
      expect(toIsoDate("5/3/2026")).toBe("2026-03-05");
    });
  });

  describe("toReverseIsoDate", () => {
    it("should convert YYYY-MM-DD to DD/MM/YYYY", () => {
      expect(toReverseIsoDate("2026-01-01")).toBe("01/01/2026");
    });
    it("should handle single digit month/day correctly when formatting", () => {
      expect(toReverseIsoDate("2026-3-5")).toBe("05/03/2026");
    });
  });

  describe("getClosedDates", () => {
    it("should return an empty array if no open dates are provided", () => {
      expect(getClosedDates([])).toEqual([]);
      expect(getClosedDates(null)).toEqual([]);
      expect(getClosedDates(undefined)).toEqual([]);
    });

    it("should correctly identify closed dates within a month (slash format)", () => {
      const openDates = ["05/03/2026", "19/03/2026", "26/03/2026"];
      // Assuming March 2026 has 31 days
      const expectedClosedDates = [
        "2026-03-01",
        "2026-03-02",
        "2026-03-03",
        "2026-03-04",
        "2026-03-06",
        "2026-03-07",
        "2026-03-08",
        "2026-03-09",
        "2026-03-10",
        "2026-03-11",
        "2026-03-12",
        "2026-03-13",
        "2026-03-14",
        "2026-03-15",
        "2026-03-16",
        "2026-03-17",
        "2026-03-18",
        "2026-03-20",
        "2026-03-21",
        "2026-03-22",
        "2026-03-23",
        "2026-03-24",
        "2026-03-25",
        "2026-03-27",
        "2026-03-28",
        "2026-03-29",
        "2026-03-30",
        "2026-03-31",
      ];
      expect(getClosedDates(openDates)).toEqual(expectedClosedDates);
    });

    it("should correctly identify closed dates within a month (hyphen format)", () => {
      const openDates = ["05-03-2026", "19-03-2026", "26-03-2026"];
      // Assuming March 2026 has 31 days
      const expectedClosedDates = [
        "2026-03-01",
        "2026-03-02",
        "2026-03-03",
        "2026-03-04",
        "2026-03-06",
        "2026-03-07",
        "2026-03-08",
        "2026-03-09",
        "2026-03-10",
        "2026-03-11",
        "2026-03-12",
        "2026-03-13",
        "2026-03-14",
        "2026-03-15",
        "2026-03-16",
        "2026-03-17",
        "2026-03-18",
        "2026-03-20",
        "2026-03-21",
        "2026-03-22",
        "2026-03-23",
        "2026-03-24",
        "2026-03-25",
        "2026-03-27",
        "2026-03-28",
        "2026-03-29",
        "2026-03-30",
        "2026-03-31",
      ];
      expect(getClosedDates(openDates)).toEqual(expectedClosedDates);
    });
  });

  describe("parseAvailability", () => {
    // Mock the current date to be 2026-03-11 for consistent test results.
    // This allows testing the 'monthsAhead' logic and date filtering reliably.
    beforeAll(() => {
      const MOCK_DATE = new Date("2026-03-11T12:00:00.000Z");
      jest.spyOn(global, "Date").mockImplementation((...args) => {
        if (args.length > 0) {
          return new RealDate(...args);
        }
        return MOCK_DATE;
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return an empty object for empty availability", () => {
      const availability = {
        openTimes: [],
        unavailableDates: [],
        bookedTimes: [],
      };
      expect(parseAvailability(availability)).toEqual({
        3: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
        4: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
        5: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
        6: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
        7: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
        8: {
          availableDates: [],
          unavailableDates: [],
          bookedTimes: [],
        },
      });
    });

    it("should correctly parse available dates and times for a given month", () => {
      const availability = {
        openTimes: [
          { days: ["Wednesday"], times: [9, 10] },
          { days: ["Thursday"], times: [11] },
        ],
        unavailableDates: [],
        bookedTimes: [],
      };
      // For March 2026, assuming 11th is Wednesday
      // The mock date is Mar 11, 2026 (Wednesday).
      // So March 11 (Wednesday) should be available, March 12 (Thursday) should be available.
      const result = parseAvailability(availability, 6);
      const march = result["3"]; // Month 3 is March

      expect(march).toBeDefined();
      expect(march.availableDates).toContainEqual({
        date: "11/03/2026",
        times: [
          { hour: 9, formatted: "09:00" },
          { hour: 10, formatted: "10:00" },
        ],
      });
      expect(march.availableDates).toContainEqual({
        date: "12/03/2026",
        times: [{ hour: 11, formatted: "11:00" }],
      });
    });

    it("should correctly parse available dates and times for a given month with mock Today date", () => {
      const availability = {
        openTimes: [
          { days: ["Wednesday"], times: [9, 10] },
          { days: ["Thursday"], times: [11] },
        ],
        unavailableDates: [],
        bookedTimes: [],
      };
      // For March 2026, assuming 11th is Wednesday
      // The mock date is Mar 11, 2026 (Wednesday).
      // So March 11 (Wednesday) should be available, March 12 (Thursday) should be available.
      const result = parseAvailability(
        availability,
        1,
        new Date("2026-03-11T08:00:00.00Z"),
      );
      const march = result["3"]; // Month 3 is March

      expect(march).toBeDefined();
      expect(march.availableDates).toContainEqual({
        date: "11/03/2026",
        times: [
          { hour: 9, formatted: "09:00" },
          { hour: 10, formatted: "10:00" },
        ],
      });
      expect(march.availableDates).toContainEqual({
        date: "12/03/2026",
        times: [{ hour: 11, formatted: "11:00" }],
      });
    });

    it("should correctly identify unavailable dates based on ranges", () => {
      const availability = {
        openTimes: [{ days: ["Wednesday"], times: [9] }],
        unavailableDates: [["11/03/2026", "12/03/2026"]], // March 11-12, 2026
        bookedTimes: [],
      };
      const result = parseAvailability(availability, 6);
      const march = result["3"];

      expect(march).toBeDefined();
      expect(march.unavailableDates).toContainEqual({ date: "11/03/2026" });
      expect(march.unavailableDates).toContainEqual({ date: "12/03/2026" });
      expect(march.availableDates).not.toContainEqual(
        expect.objectContaining({ date: "11/03/2026" }),
      ); // Should not be available if unavailable
    });

    it("should correctly parse booked times", () => {
      const availability = {
        openTimes: [{ days: ["Wednesday"], times: [9, 10, 11] }],
        unavailableDates: [],
        bookedTimes: [
          "2026-03-11 09:00:00.00", // Booked on Mar 11 at 09:00
          new Date("2026-03-11 11:00:00.00").toISOString(), // Booked on Mar 11 at 11:00
        ],
      };
      const result = parseAvailability(availability, 6);
      const march = result["3"];

      expect(march).toBeDefined();
      expect(march.bookedTimes).toContainEqual({
        date: "11/03/2026",
        times: ["09:00", "11:00"],
      });
    });

    it("should not include dates before the current date", () => {
      const availability = {
        openTimes: [{ days: ["Tuesday"], times: [9] }], // Mar 10, 2026 was Tuesday
        unavailableDates: [],
        bookedTimes: [],
      };
      const result = parseAvailability(
        availability,
        1,
        new Date("2026-03-11T08:00:00.00Z"),
      );

      console.log(result);
      const march = result["3"];

      expect(march).toBeDefined();
      expect(march.availableDates).not.toContainEqual(
        expect.objectContaining({ date: "10/03/2026" }),
      );
    });

    it("should generate availability for the specified number of months ahead", () => {
      const availability = {
        openTimes: [{ days: ["Wednesday"], times: [9] }],
        unavailableDates: [],
        bookedTimes: [],
      };
      // Current date mock is 2026-03-11
      // Requesting 2 months means March and April
      const result = parseAvailability(
        availability,
        2,
        new Date("2026-03-11T08:00:00.00Z"),
      );

      expect(result["3"]).toBeDefined(); // March
      expect(result["4"]).toBeDefined(); // April
      expect(result["5"]).toBeUndefined(); // May should not be there
    });

    it("should handle mixed availability scenarios correctly", () => {
      const availability = {
        openTimes: [
          { days: ["Wednesday"], times: [9, 10] }, // Mar 11, Apr 8
          { days: ["Friday"], times: [14] }, // Mar 13, Apr 10
        ],
        unavailableDates: [["13/03/2026", "13/03/2026"]], // Mar 13 unavailable
        bookedTimes: ["2026-04-10 14:00:00.00"], // Apr 10 booked
      };

      const result = parseAvailability(
        availability,
        2,
        new Date("2026-03-11T08:00:00.00Z"),
      ); // March and April

      // March checks
      const march = result["3"];
      expect(march.availableDates).toContainEqual({
        date: "11/03/2026",
        times: [
          { hour: 9, formatted: "09:00" },
          { hour: 10, formatted: "10:00" },
        ],
      });
      expect(march.unavailableDates).toContainEqual({ date: "13/03/2026" });
      expect(march.availableDates).not.toContainEqual(
        expect.objectContaining({ date: "13/03/2026" }),
      );

      // April checks
      const april = result["4"];
      expect(april.availableDates).toContainEqual({
        date: "08/04/2026",
        times: [
          { hour: 9, formatted: "09:00" },
          { hour: 10, formatted: "10:00" },
        ],
      });
      expect(april.bookedTimes).toContainEqual({
        date: "10/04/2026",
        times: ["14:00"],
      });
      expect(april.availableDates).toContainEqual({
        date: "10/04/2026",
        times: [{ hour: 14, formatted: "14:00" }],
      });
    });
  });

  describe("getFirstAvailableDate", () => {
    it("should return null if no parsed dates are provided", () => {
      expect(getFirstAvailableDate(null)).toBeNull();
      expect(getFirstAvailableDate({})).toBeNull();
    });

    it("should return the first available date across multiple months, starting from the current month", () => {
      // Mock current date to be 2026-03-11
      const parsedAvailability = {
        3: {
          availableDates: [
            { date: "12/03/2026", times: [{ hour: 9 }] },
            { date: "14/03/2026", times: [{ hour: 10 }] },
          ],
          unavailableDates: [],
          bookedTimes: [],
        },
        4: {
          availableDates: [{ date: "05/04/2026", times: [{ hour: 11 }] }],
          unavailableDates: [],
          bookedTimes: [],
        },
      };
      expect(getFirstAvailableDate(parsedAvailability)).toBe("12/03/2026");
    });

    it("should correctly handle when the first available date is in a future month", () => {
      // Mock current date to be 2026-03-11
      const parsedAvailability = {
        3: { availableDates: [], unavailableDates: [], bookedTimes: [] },
        4: {
          availableDates: [{ date: "01/04/2026", times: [{ hour: 9 }] }],
          unavailableDates: [],
          bookedTimes: [],
        },
      };
      expect(getFirstAvailableDate(parsedAvailability)).toBe("01/04/2026");
    });

    it("should return the earliest available date if multiple are available in the first available month", () => {
      // Mock current date to be 2026-03-11
      const parsedAvailability = {
        3: {
          availableDates: [
            { date: "16/03/2026", times: [{ hour: 9 }] },
            { date: "14/03/2026", times: [{ hour: 10 }] },
          ],
          unavailableDates: [],
          bookedTimes: [],
        },
      };
      expect(getFirstAvailableDate(parsedAvailability)).toBe("14/03/2026");
    });

    it("should return null if no available dates are found across all months", () => {
      const parsedAvailability = {
        3: { availableDates: [], unavailableDates: [], bookedTimes: [] },
        4: { availableDates: [], unavailableDates: [], bookedTimes: [] },
      };
      expect(getFirstAvailableDate(parsedAvailability)).toBeNull();
    });

    it("should handle months out of order gracefully (e.g., if April comes before March in the object)", () => {
      // Mock current date to be 2026-03-11
      const parsedAvailability = {
        4: {
          availableDates: [{ date: "05/04/2026", times: [{ hour: 11 }] }],
          unavailableDates: [],
          bookedTimes: [],
        },
        3: {
          availableDates: [{ date: "12/03/2026", times: [{ hour: 9 }] }],
          unavailableDates: [],
          bookedTimes: [],
        },
      };
      expect(getFirstAvailableDate(parsedAvailability)).toBe("12/03/2026");
    });
  });

  describe("dateUtils", () => {
    let mockDate;

    beforeEach(() => {
      // Mock current date to be 2026-03-11 for all dateUtils tests
      mockDate = new Date("2026-03-11T12:00:00.000Z");
      jest.spyOn(global, "Date").mockImplementation((...args) => {
        if (args.length > 0) {
          return new RealDate(...args);
        }
        return mockDate;
      });
      // jest.spyOn(mockDate, "setHours").mockReturnThis(); // Mock setHours to avoid altering the mockDate
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe("findNext", () => {
      it("should return null if no dates are provided", () => {
        expect(dateUtils.findNext([])).toBeNull();
        expect(dateUtils.findNext(null)).toBeNull();
        expect(dateUtils.findNext(undefined)).toBeNull();
      });

      it("should return the first future or present date", () => {
        const dates = [
          "01/03/2026", // Past
          "11/03/2026", // Today
          "30/03/2026", // Future
          "01/04/2026", // Future
        ];
        expect(dateUtils.findNext(dates, mockDate)).toBe("11/03/2026");
      });

      it("should return null if only past dates are provided", () => {
        const dates = ["01/03/2026", "10/03/2026"]; // All past
        expect(dateUtils.findNext(dates, mockDate)).toBeNull();
      });

      it("should handle dates with single digit month/day correctly", () => {
        const dates = ["1/3/2026", "11/3/2026", "5/4/2026"];
        expect(dateUtils.findNext(dates, mockDate)).toBe("11/3/2026");
      });
    });

    describe("findAllFuture", () => {
      it("should return an empty array if no dates are provided", () => {
        expect(dateUtils.findAllFuture([])).toEqual([]);
        expect(dateUtils.findAllFuture(null)).toEqual([]);
        expect(dateUtils.findAllFuture(undefined)).toEqual([]);
      });

      it("should return all future or present dates, sorted chronologically", () => {
        const dates = [
          "30/03/2026", // Future
          "01/03/2026", // Past
          "11/03/2026", // Today
          "01/04/2026", // Future
          "10/03/2026", // Past
        ];
        expect(dateUtils.findAllFuture(dates, mockDate)).toEqual([
          "11/03/2026",
          "30/03/2026",
          "01/04/2026",
        ]);
      });

      it("should return an empty array if only past dates are provided", () => {
        const dates = ["01/03/2026", "10/03/2026"];
        expect(dateUtils.findAllFuture(dates, mockDate)).toEqual([]);
      });

      it("should handle dates with single digit month/day correctly", () => {
        const dates = ["1/3/2026", "11/3/2026", "5/4/2026"];
        expect(dateUtils.findAllFuture(dates, mockDate)).toEqual([
          "11/3/2026",
          "5/4/2026",
        ]);
      });
    });

    describe("isFutureOrToday", () => {
      it("should return true for today's date", () => {
        expect(dateUtils.isFutureOrToday("11/03/2026", mockDate)).toBe(true);
      });

      it("should return true for a future date", () => {
        expect(dateUtils.isFutureOrToday("30/03/2026", mockDate)).toBe(true);
        expect(dateUtils.isFutureOrToday("01/04/2026", mockDate)).toBe(true);
      });

      it("should return false for a past date", () => {
        expect(dateUtils.isFutureOrToday("01/03/2026", mockDate)).toBe(false);
      });

      it("should return false for an invalid date string", () => {
        expect(dateUtils.isFutureOrToday("invalid-date")).toBe(false);
        expect(dateUtils.isFutureOrToday("01/13/2026", mockDate)).toBe(false); // Invalid month
      });
    });

    describe("toAmPm", () => {
      it("should convert 24h format to AM/PM format correctly", () => {
        expect(dateUtils.toAmPm(0)).toBe("12 am");
        expect(dateUtils.toAmPm(1)).toBe("1 am");
        expect(dateUtils.toAmPm(11)).toBe("11 am");
        expect(dateUtils.toAmPm(12)).toBe("12 pm");
        expect(dateUtils.toAmPm(13)).toBe("1 pm");
        expect(dateUtils.toAmPm(23)).toBe("11 pm");
      });
    });

    describe("to24hFormat", () => {
      it("should convert AM/PM format to 24h format correctly", () => {
        expect(dateUtils.to24hFormat("12 am")).toBe("00:00");
        expect(dateUtils.to24hFormat("1 am")).toBe("01:00");
        expect(dateUtils.to24hFormat("11 am")).toBe("11:00");
        expect(dateUtils.to24hFormat("12 pm")).toBe("12:00");
        expect(dateUtils.to24hFormat("1 pm")).toBe("13:00");
        expect(dateUtils.to24hFormat("11 pm")).toBe("23:00");
        expect(dateUtils.to24hFormat("9:30 pm")).toBe("21:30");
      });
    });

    describe("convertTimesToHours", () => {
      it("should convert an array of AM/PM time strings to 24-hour integers", () => {
        const times = ["9 am", "12 pm", "3 pm", "12 am"];
        expect(dateUtils.convertTimesToHours(times)).toEqual([9, 12, 15, 0]);
      });

      it("should handle times with minutes", () => {
        const times = ["9:30 am", "1:15 pm"];
        expect(dateUtils.convertTimesToHours(times)).toEqual([9, 13]); // Minutes are ignored by this function's logic
      });

      it("should return an empty array for empty input", () => {
        expect(dateUtils.convertTimesToHours([])).toEqual([]);
      });
    });
  });
});
