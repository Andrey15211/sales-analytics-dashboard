import { describe, expect, it } from "vitest";
import { parseOrdersCsv } from "./csv";

describe("parseOrdersCsv", () => {
  it("parses and normalizes a valid CSV", () => {
    const csv = [
      "id,date,customer,product,category,quantity,price,status",
      "ORD-1,2026-06-01,Анна,Ноутбук,Электроника,2,100000,Доставлен",
    ].join("\n");

    const result = parseOrdersCsv(csv);
    expect(result.orders[0]).toMatchObject({ quantity: 2, price: 100000, status: "delivered" });
    expect(result.errors).toEqual([]);
  });

  it("rejects a CSV with missing columns", () => {
    const result = parseOrdersCsv("id,date\nORD-1,2026-06-01");
    expect(result.orders).toEqual([]);
    expect(result.errors[0]).toContain("Отсутствуют столбцы");
  });

  it("rejects invalid values", () => {
    const csv = [
      "id,date,customer,product,category,quantity,price,status",
      "ORD-1,bad-date,Анна,Ноутбук,Электроника,0,nope,Неизвестно",
    ].join("\n");
    expect(parseOrdersCsv(csv).errors).toHaveLength(1);
  });

  it("returns validation errors in English", () => {
    const result = parseOrdersCsv("id,date\nORD-1,2026-06-01", "en");
    expect(result.errors[0]).toContain("Missing columns");
  });
});
