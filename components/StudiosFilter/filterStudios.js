import moment from "moment";

const today = moment();
const nextWeek = moment().add(7, "days");
const nextMonth = moment().add(1, "months");
const nextYear = moment().add(1, "years");

const filterStudios = ({ studios, query: { day, mediums, district } }) => {
  let filtered = studios;
  // sessionStorage.setItem("filters", JSON.stringify(filters));

  // if (day !== false && day !== "All") {
  //   filtered = filtered.filter((studio) => {
  //     const datesArray = studio.dates.map((d) => d.toDate());
  //     const dates = datesArray.map((d) => moment(d, "DD/MM/YYYY hh:mm"));

  //     const isNextWeek = dates.some((d) => d.isBetween(today, nextWeek));
  //     const isNextMonth = dates.some((d) => d.isBetween(today, nextMonth));
  //     const isLater = dates.some((d) => d.isBetween(nextMonth, nextYear));

  //     let result = isNextWeek ? "week " : "";
  //     result += isNextMonth ? "month " : "";
  //     result += isLater ? "later" : "";

  //     return result.includes(day);
  //   });
  // }

  if (mediums && mediums !== false && mediums !== "All") {
    filtered = filtered.filter((studio) => {
      const style = mediums.toLowerCase();
      return studio.styles.includes(style);
    });
  }

  if (district && district !== false && district !== "All") {
    filtered = filtered.filter((studio) => {
      return studio.district.includes(district);
    });
  }

  return filtered;
};

// load filters from sessionStorage
// useEffect(() => {
//     // if (studioIDRoute > 0 && studioIDRoute <= studios.length) {
//     //   openstudio(studioIDRoute);
//     // }

//     // let savedfilters = sessionStorage.getItem("filters");
//     // if (savedfilters) {
//     //   savedfilters = JSON.parse(savedfilters);
//     //   setTheDay(savedfilters.day);
//     //   setTheCat(savedfilters.cat);
//     //   setThedistrict(savedfilters.district);
//     //   filterstudios(savedfilters);
//     // } else {
//     //   filterstudios({ day: theDay, cat: theCat, district: thedistrict });
//     // }

//     filterstudios({ day: theDay, cat: theCat, district: thedistrict });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [studios]);

export default filterStudios;
