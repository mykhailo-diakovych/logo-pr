import dayjs from "dayjs";

export const formatDate = (date: dayjs.ConfigType) => {
  return dayjs(date).format("DD.MM.YYYY");
};

export const formatDateMonthString = (date: dayjs.ConfigType) => {
  return dayjs(date).format("MMMM D, YYYY");
};

export const calculateYears = (date: string) => {
  return dayjs().diff(dayjs(date), "years");
};
