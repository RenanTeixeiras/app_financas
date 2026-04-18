export function getCurrentMonthValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${today.getFullYear()}-${month}`;
}

export function getMonthRange(month?: string) {
  if (!month) {
    return null;
  }

  const [yearValue, monthValue] = month.split("-");
  const year = Number(yearValue);
  const monthIndex = Number(monthValue) - 1;

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));

  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
  };
}

export function formatEntryDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatMonthLabel(value: string) {
  const range = getMonthRange(value);

  if (!range) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${range.start}T00:00:00`));
}

export function formatMonthShortLabel(value: string) {
  const range = getMonthRange(value);

  if (!range) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(new Date(`${range.start}T00:00:00`));
}

export function getRecentMonthValues(endMonth: string, count: number) {
  const range = getMonthRange(endMonth);

  if (!range) {
    return [];
  }

  const [yearValue, monthValue] = endMonth.split("-");
  const baseYear = Number(yearValue);
  const baseMonthIndex = Number(monthValue) - 1;

  return Array.from({ length: Math.max(1, count) }, (_, index) => {
    const offset = Math.max(1, count) - index - 1;
    const date = new Date(Date.UTC(baseYear, baseMonthIndex - offset, 1));

    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}
