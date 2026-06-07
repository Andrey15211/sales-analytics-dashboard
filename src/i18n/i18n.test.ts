import { describe, expect, it } from "vitest";
import { dictionaries, getDictionary, normalizeOrderStatus } from "./index";

describe("i18n", () => {
  it("uses Russian as the default dictionary", () => {
    expect(getDictionary().locale).toBe("ru");
    expect(getDictionary().app.title).toBe("Аналитика продаж");
  });

  it("keeps the Russian and English dictionary shapes aligned", () => {
    expect(Object.keys(dictionaries.en)).toEqual(Object.keys(dictionaries.ru));
    expect(Object.keys(dictionaries.en.table)).toEqual(Object.keys(dictionaries.ru.table));
    expect(Object.keys(dictionaries.en.errors)).toEqual(Object.keys(dictionaries.ru.errors));
  });

  it("normalizes Russian and English CSV statuses to stable codes", () => {
    expect(normalizeOrderStatus("Доставлен")).toBe("delivered");
    expect(normalizeOrderStatus("Delivered")).toBe("delivered");
    expect(normalizeOrderStatus("unknown")).toBeNull();
  });
});
