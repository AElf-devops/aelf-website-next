export const formatDate = (date: string, type: "MDY" | "DMY" = "MDY") => {
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
  if (type === "MDY") {
    return newDate;
  }

  if (type === "DMY") {
    const tempDate = newDate.replace(",", "");
    const dateArr = tempDate.split(" ");
    const tempDateArr = [dateArr[1], dateArr[0], dateArr[2]];
    return tempDateArr.join(" ");
  }
  return newDate;
};
