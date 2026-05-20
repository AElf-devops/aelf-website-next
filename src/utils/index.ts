export const formatDate = (
  date: string,
  type: "MDY" | "DMY" = "MDY",
  month: "short" | "long" = "short"
) => {
  if (!date) {
    return "";
  }

  const originalDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month,
    day: month === "long" ? "numeric" : "2-digit",
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

export function toSnakeCase(str: string) {
  return str.toLowerCase().replace(/\s+/g, "_");
}
