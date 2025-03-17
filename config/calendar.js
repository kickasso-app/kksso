import moment from "moment";

const today = new Date();
//  console.log(today);

const todayDate = moment(today).format("YYYY-MM-DD");

const Start = todayDate;
const End = "2026-12-31";

export const calendarBounds = [Start, End];
