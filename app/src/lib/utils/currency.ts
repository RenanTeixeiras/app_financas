export function parseCurrencyInputToCents(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("Informe um valor.");
  }

  const digits = normalized.replace(/\D/g, "");

  if (!digits) {
    throw new Error("Informe um valor válido.");
  }

  const amountCents = Number(digits);

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("O valor deve ser positivo.");
  }

  return amountCents;
}

export function formatCurrencyFromCents(amountCents: number, locale = "pt-BR", currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

export function formatCentsToInputValue(amountCents: number) {
  return (amountCents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const padded = digits.padStart(3, "0");
  const integerPart = padded.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = padded.slice(-2);

  return `${integerPart},${decimalPart}`;
}
