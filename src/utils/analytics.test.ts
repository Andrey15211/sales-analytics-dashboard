import { describe, expect, it } from "vitest";
import type { Order } from "../types/order";
import {
  calculateKpis,
  filterOrdersByRange,
  getCategoryOrders,
  getDailyRevenue,
  getDailyRevenueForRange,
  getStatusDistribution,
  getTopProducts,
} from "./analytics";

const orders: Order[] = [
  { id: "1", date: "2026-05-01", customer: "Анна", product: "Ноутбук", category: "electronics", quantity: 1, price: 100000, status: "delivered" },
  { id: "2", date: "2026-05-02", customer: "Борис", product: "Кресло", category: "furniture", quantity: 2, price: 20000, status: "processing" },
  { id: "3", date: "2026-05-08", customer: "Анна", product: "Ноутбук", category: "electronics", quantity: 1, price: 100000, status: "cancelled" },
];

describe("analytics", () => {
  it("calculates revenue, orders, average order value and unique customers", () => {
    expect(calculateKpis(orders)).toEqual({
      revenue: 240000,
      orders: 3,
      averageOrderValue: 80000,
      customers: 2,
    });
  });

  it("filters inclusive date ranges", () => {
    expect(filterOrdersByRange(orders, new Date("2026-05-01"), new Date("2026-05-02"))).toHaveLength(2);
  });

  it("builds chart-ready aggregations", () => {
    expect(getDailyRevenue(orders)[0]).toMatchObject({ date: "2026-05-01", revenue: 100000 });
    expect(getCategoryOrders(orders)[0]).toEqual({ name: "electronics", value: 2 });
    expect(getTopProducts(orders)[0]).toEqual({ name: "Ноутбук", value: 200000 });
    expect(getStatusDistribution(orders)).toContainEqual({ name: "delivered", value: 1 });
  });

  it("fills missing days with zero revenue for a selected range", () => {
    expect(
      getDailyRevenueForRange(orders.slice(0, 1), {
        start: new Date("2026-05-01"),
        end: new Date("2026-05-03"),
      }),
    ).toEqual([
      { date: "2026-05-01", revenue: 100000 },
      { date: "2026-05-02", revenue: 0 },
      { date: "2026-05-03", revenue: 0 },
    ]);
  });
});
