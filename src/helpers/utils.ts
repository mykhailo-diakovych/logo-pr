export const convertEnumToSelectOptions = (object: Record<string, string>) =>
  Object.entries(object).map(([label, value]) => ({ label, value }));
export const convertConstantsToSelectOptions = (
  object: Record<string, string> | null | undefined
) =>
  object
    ? Object.entries(object).map(([value, label]) => ({ label, value }))
    : [];

export const makeShortHand = (firstName: string, lastName: string) => {
  if (!firstName || !lastName) return "";

  const firstLetter = firstName.at(0);
  const lastLetter = lastName.at(0);

  return `${firstLetter}${lastLetter}`;
};

export const downloadFile = (href: string) => {
  window.open(href, "_blank")!.focus();
};

export const getFullName = <T extends { firstName: string; lastName: string }>(
  entity: T | null | undefined,
  defaultValue = "-"
) => {
  if (!entity) return defaultValue;

  const firstName = entity.firstName ?? " ";
  const lastName = entity.lastName ?? " ";

  return `${firstName} ${lastName}`.trim();
};
