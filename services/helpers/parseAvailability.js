import moment from "moment";

const toIsoDate = (date) => moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
const toReverseIsoDate = (date) =>
  moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");

/**
 * Parses availability object and returns available and unavailable dates by month
 * @param {Object} availability - Availability object with openTimes and unavailableDates
 * @param {number} monthsAhead - Number of months to generate availability for (default: 3)
 * @returns {Object} Monthly availability with available and unavailable dates
 */
const parseAvailability = (availability, monthsAhead = 6) => {
  const {
    openTimes = [],
    unavailableDates = [],
    bookedTimes = [],
  } = availability;

  // Create map of days to their available times
  const availableTimesByDay = openTimes.reduce((acc, { days, times }) => {
    days.forEach((day) => {
      acc[day] = [...new Set(times)].sort((a, b) => a - b);
    });
    return acc;
  }, {});

  // Parse unavailable date ranges
  const unavailableDateRanges = unavailableDates.map(([start, end]) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };
    return [parseDate(start), parseDate(end)];
  });

  // Parse booked times
  const bookedTimesMap = bookedTimes.reduce((acc, bookedTime) => {
    const date = moment(bookedTime).format("DD/MM/YYYY");
    const time = moment(bookedTime).format("HH:mm");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(time);
    return acc;
  }, {});

  // Initialize result object
  const result = {};

  // Get current date
  const currentDate = new Date();

  // Process each month
  for (let monthOffset = 0; monthOffset < monthsAhead; monthOffset++) {
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      1
    );

    const monthKey = currentMonth.toLocaleString("default", {
      month: "numeric",
      // year: "numeric",
    });

    result[monthKey] = {
      availableDates: [],
      unavailableDates: [],
      bookedTimes: [],
    };

    // Get last day of month
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    // Check each day of the month
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Skip dates before today
      if (
        date <
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      ) {
        continue;
      }

      // Get day name using 'long' format
      const dayName = date.toLocaleString("default", { weekday: "long" });
      const availableTimes = availableTimesByDay[dayName];

      // Format date as DD/MM/YYYY
      const formattedDate = [
        String(date.getDate()).padStart(2, "0"),
        String(date.getMonth() + 1).padStart(2, "0"),
        date.getFullYear(),
      ].join("/");

      // Check if date falls within unavailable ranges
      const isUnavailable = unavailableDateRanges.some(
        ([start, end]) => date >= start && date <= end
      );

      if (isUnavailable) {
        result[monthKey].unavailableDates.push({
          date: formattedDate,
        });
      } else if (availableTimes?.length > 0) {
        result[monthKey].availableDates.push({
          date: formattedDate,
          times: availableTimes.map((time) => ({
            hour: time,
            formatted: `${String(time).padStart(2, "0")}:00`,
          })),
        });
      }

      // Add booked times if any
      if (bookedTimesMap[formattedDate]) {
        result[monthKey].bookedTimes.push({
          date: formattedDate,
          times: bookedTimesMap[formattedDate],
        });
      }
    }
  }

  return result;
};

// Helper function to get available times for a specific date
const getAvailableTimesForDate = (availability, date) => {
  const [day, month, year] = date.split("/");
  const monthKey = new Date(year, month - 1, day).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const monthData = availability[monthKey];
  if (!monthData) return null;

  return monthData.availableDates.find(
    (availableDate) => availableDate.date === date
  );
};

// Helper function to check if a date is unavailable
const isDateUnavailable = (availability, date) => {
  const [day, month, year] = date.split("/");
  const monthKey = new Date(year, month - 1, day).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const monthData = availability[monthKey];
  if (!monthData) return false;

  return monthData.unavailableDates.some(
    (unavailableDate) => unavailableDate.date === date
  );
};

// Example usage
const exampleAvailability = {
  openTimes: [
    {
      days: ["Wednesday", "Tuesday"],
      times: [9, 11, 13, 14],
    },
  ],
  unavailableDates: [["11/03/2025", "14/03/2025"]],
};

// Test the function
// const availability = parseAvailability(exampleAvailability, 2);
// console.log("Monthly Availability:", availability);

// // Test helper functions
// console.log(
//   "Available times for 12/03/2025:",
//   getAvailableTimesForDate(availability, "12/03/2025")
// );

// console.log(
//   "Is 13/03/2025 unavailable:",
//   isDateUnavailable(availability, "13/03/2025")
// );

// // Example usage of helper functions
// console.log(
//   "Available times for 12/03/2025:",
//   getAvailableTimesForDate(availability, "12/03/2025")
// );

// console.log(
//   "Is 13/03/2025 unavailable:",
//   isDateUnavailable(availability, "13/03/2025")
// );

/**
 * Gets all dates in a month except the open dates
 * @param {Array} openDates - Array of open dates in DD/MM/YYYY format
 * @returns {Array} Array of closed dates in YYYY-MM-DD format
 */
const getClosedDates = (openDates) => {
  // If no open dates, return empty array
  if (!openDates || openDates.length === 0) {
    return [];
  }

  const dateSeparate = openDates[0].includes("/") ? "/" : "-";

  //   const datesWithHyphen = convertDateFormat(datesWithSlash);

  // Get month and year from the first open date
  const [day, month, year] = openDates[0].split(dateSeparate).map(Number);

  const isoOpenDates = openDates.map(toIsoDate);

  // const readableDate = (date) =>
  //   moment(date, "YYYY-MM-DD hh:mm").format("D MMMM");

  // Get number of days in the month
  const lastDay = new Date(year, month, 0).getDate();

  // Generate all dates in the month
  const allDates = Array.from({ length: lastDay }, (_, index) => {
    const currentDay = index + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(
      currentDay
    ).padStart(2, "0")}`;
  });

  // Return dates that are not in openDates
  return allDates.filter((date) => !isoOpenDates.includes(date));
};

// Example usage
const openDates = ["05/03/2025", "19/03/2025", "26/03/2025"];
// console.log(openDates);
const closedDates = getClosedDates(openDates);
// console.log("Closed dates:", closedDates);

/**
 * Alternative version that returns an object with both open and closed dates
 * @param {Array} openDates - Array of open dates in DD-MM-YYYY format
 * @returns {Object} Object containing arrays of open and closed dates
 */
const getDatesStatus = (openDates) => {
  if (!openDates || openDates.length === 0) {
    return { openDates: [], closedDates: [] };
  }

  const [day, month, year] = openDates[0].split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();

  const allDates = Array.from({ length: lastDay }, (_, index) => {
    const currentDay = index + 1;
    return `${String(currentDay).padStart(2, "0")}-${String(month).padStart(
      2,
      "0"
    )}-${year}`;
  });

  return {
    openDates: openDates,
    closedDates: allDates.filter((date) => !openDates.includes(date)),
  };
};

// Example usage of alternative version
// const datesStatus = getDatesStatus(openDates);
// console.log("Dates status:", datesStatus);

/**
 * Utility function to convert dates between formats
 * @param {Array} dates - Array of dates
 * @param {string} fromFormat - Current format separator (e.g., '/' or '-')
 * @param {string} toFormat - Desired format separator (e.g., '/' or '-')
 * @returns {Array} Array of dates in new format
 */
const convertDateFormat = (dates, fromFormat = "/", toFormat = "-") => {
  return dates.map((date) => date.split(fromFormat).join(toFormat));
};

// Example of format conversion
const datesWithSlash = ["05/03/2025", "19/03/2025", "26/03/2025"];
const datesWithHyphen = convertDateFormat(datesWithSlash);
// console.log("Converted dates:", datesWithHyphen);

/**
 * Finds the first future or present date from an array of dates
 * @param {string[]} dates - Array of dates in DD/MM/YYYY format
 * @returns {string|null} First future or present date, or null if none found
 */
const findNextDate = (dates) => {
  // Return null if no dates provided
  if (!dates || !dates.length) {
    return null;
  }

  // Get today's date at start of day (midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Convert dates to Date objects and filter out invalid dates
    const validDates = dates
      .map((dateStr) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return {
          original: dateStr,
          date: new Date(year, month - 1, day),
        };
      })
      .filter(({ date }) => !isNaN(date.getTime()));

    // Sort dates chronologically
    validDates.sort((a, b) => a.date - b.date);

    // Find first date that's today or in the future
    const nextDate = validDates.find(({ date }) => date >= today);

    return nextDate ? nextDate.original : null;
  } catch (error) {
    console.error("Error processing dates:", error);
    return null;
  }
};

/**
 * Enhanced version with additional features
 */
const dateUtils = {
  /**
   * Finds the first future or present date
   */
  findNext: (dates) => {
    if (!dates || !dates.length) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const validDates = dates
        .map((dateStr) => {
          const [day, month, year] = dateStr.split("/").map(Number);
          return {
            original: dateStr,
            date: new Date(year, month - 1, day),
          };
        })
        .filter(({ date }) => !isNaN(date.getTime()));

      validDates.sort((a, b) => a.date - b.date);

      const nextDate = validDates.find(({ date }) => date >= today);
      return nextDate ? nextDate.original : null;
    } catch (error) {
      console.error("Error processing dates:", error);
      return null;
    }
  },

  /**
   * Returns all future or present dates
   */
  findAllFuture: (dates) => {
    if (!dates || !dates.length) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      return dates
        .map((dateStr) => {
          const [day, month, year] = dateStr.split("/").map(Number);
          return {
            original: dateStr,
            date: new Date(year, month - 1, day),
          };
        })
        .filter(({ date }) => !isNaN(date.getTime()) && date >= today)
        .sort((a, b) => a.date - b.date)
        .map(({ original }) => original);
    } catch (error) {
      console.error("Error processing dates:", error);
      return [];
    }
  },

  /**
   * Checks if a date is today or in the future
   */
  isFutureOrToday: (dateStr) => {
    try {
      const [day, month, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today;
    } catch (error) {
      console.error("Error processing date:", error);
      return false;
    }
  },
  /**
   * changes the times fromat from 24h to am and pm
   */
  toAmPm: (hour) => {
    if (hour === 0) return "12 am";
    if (hour === 12) return "12 pm";
    return hour < 12 ? `${hour} am` : `${hour - 12} pm`;
  },

  /**
   * changes the times fromat from am and pm to 24h
   */
  to24hFormat: (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier.toLowerCase() === "pm") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes || "00"}`;
  },
  convertTimesToHours: (times) => {
    return times.map((timeStr) => {
      // Extract hour and period (am/pm)
      const [time, period] = timeStr.toLowerCase().split(" ");
      let hour = parseInt(time.split(":")[0]);

      // Convert to 24-hour format
      if (period === "pm" && hour !== 12) {
        hour += 12;
      } else if (period === "am" && hour === 12) {
        hour = 0;
      }

      return hour;
    });
  },
};

// Example usage
const dates = [
  "01/03/2024",
  "15/03/2024",
  "30/03/2024",
  "01/02/2024", // Past date
  "27/02/2025",
];

// Using simple version
// console.log("Next date:", findNextDate(dates));

// // Using enhanced version
// console.log("Next date (enhanced):", dateUtils.findNext(dates));
// console.log("All future dates:", dateUtils.findAllFuture(dates));
// console.log("Is future date:", dateUtils.isFutureOrToday("30/03/2024"));

// Example with invalid dates
const mixedDates = [
  "invalid",
  "01/13/2024", // Invalid month
  "15/03/2024",
  "30/03/2024",
];
// console.log("Handling invalid dates:", findNextDate(mixedDates));

// Example with empty array
// console.log("Empty array:", findNextDate([]));

// Example with today's date
const today = new Date();
const todayFormatted = `${String(today.getDate()).padStart(2, "0")}/${String(
  today.getMonth() + 1
).padStart(2, "0")}/${today.getFullYear()}`;
const datesWithToday = [...dates, todayFormatted];
// console.log("Including today:", findNextDate(datesWithToday));

const getFirstAvailableDate = (parsedDates) => {
  if (!parsedDates || Object.keys(parsedDates).length === 0) {
    return null;
  }

  // Flatten available dates and sort them
  const allAvailableDates = Object.values(parsedDates)
    .flatMap((month) => month.availableDates)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Return the first available date or null if none found
  return allAvailableDates.length > 0 ? allAvailableDates[0].date : null;
};
// Example usage of getFirstAvailableDate

export {
  parseAvailability,
  getFirstAvailableDate,
  isDateUnavailable,
  getClosedDates,
  dateUtils,
  toIsoDate,
  toReverseIsoDate,
};
