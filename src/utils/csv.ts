import Papa from "papaparse";
import { CSV_COLUMNS, type Order } from "../types/order";
import { getDictionary, normalizeOrderStatus, type Locale } from "../i18n";

type CsvRow = Record<string, string>;

export type CsvParseResult = {
  orders: Order[];
  errors: string[];
};

function validateRow(row: CsvRow, index: number, locale: Locale): string | null {
  const t = getDictionary(locale).errors;
  const missingValue = CSV_COLUMNS.find((column) => !String(row[column] ?? "").trim());
  if (missingValue) return `${t.row} ${index}: ${t.emptyField} “${missingValue}”.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date) || Number.isNaN(Date.parse(`${row.date}T00:00:00`))) {
    return `${t.row} ${index}: ${t.invalidDate}`;
  }
  if (!Number.isInteger(Number(row.quantity)) || Number(row.quantity) <= 0) {
    return `${t.row} ${index}: ${t.invalidQuantity}`;
  }
  if (!Number.isFinite(Number(row.price)) || Number(row.price) <= 0) {
    return `${t.row} ${index}: ${t.invalidPrice}`;
  }
  if (!normalizeOrderStatus(row.status)) {
    return `${t.row} ${index}: ${t.invalidStatus} “${row.status}”.`;
  }
  return null;
}

export function parseOrdersCsv(csv: string, locale: Locale = "ru"): CsvParseResult {
  const t = getDictionary(locale).errors;
  const parsed = Papa.parse<CsvRow>(csv.trim(), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase(),
    transform: (value) => value.trim(),
  });

  if (parsed.errors.length) {
    return { orders: [], errors: [`${t.csvRead}: ${parsed.errors[0].message}`] };
  }

  const fields = parsed.meta.fields ?? [];
  const missingColumns = CSV_COLUMNS.filter((column) => !fields.includes(column));
  if (missingColumns.length) {
    return {
      orders: [],
      errors: [`${t.missingColumns}: ${missingColumns.join(", ")}.`],
    };
  }

  if (!parsed.data.length) {
    return { orders: [], errors: [t.emptyCsv] };
  }

  const rowErrors = parsed.data
    .map((row, index) => validateRow(row, index + 2, locale))
    .filter((error): error is string => Boolean(error));

  if (rowErrors.length) return { orders: [], errors: rowErrors };

  return {
    orders: parsed.data.map((row) => ({
      id: row.id,
      date: row.date,
      customer: row.customer,
      product: row.product,
      category: row.category,
      quantity: Number(row.quantity),
      price: Number(row.price),
      status: normalizeOrderStatus(row.status) as Order["status"],
    })),
    errors: [],
  };
}

export function parseOrdersFile(file: File, locale: Locale = "ru") {
  return file.text().then((csv) => parseOrdersCsv(csv, locale));
}
