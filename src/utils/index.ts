export const formattedDateToMDY = (date: string) => {
  if (!date) {
    return "";
  }
  const originalDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const newDate = originalDate.toLocaleDateString("en-US", options);
  return newDate;
};

export const formattedDateToDMY = (date: string) => {
  if (!date) {
    return "";
  }
  const originalDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const newDate = originalDate
    .toLocaleDateString("en-US", options)
    .replace(",", "");

  const dateArr = newDate.split(" ");
  const tempDateArr = [dateArr[1], dateArr[0], dateArr[2]];
  return tempDateArr.join(" ");
};
