import type { Order } from "../types/order";

export type DateRange = {
  start: Date;
  end: Date;
};

export type Kpis = {
  revenue: number;
  orders: number;
  averageOrderValue: number;
  customers: number;
};

const toDay = (value: string | Date) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const revenueOf = (order: Order) => order.quantity * order.price;

export function filterOrdersByRange(orders: Order[], start: Date, end: Date) {
  const startTime = toDay(start).getTime();
  const endTime = toDay(end).getTime();
  return orders.filter((order) => {
    const time = toDay(`${order.date}T00:00:00`).getTime();
    return time >= startTime && time <= endTime;
  });
}

export function calculateKpis(orders: Order[]): Kpis {
  const revenue = orders.reduce((sum, order) => sum + revenueOf(order), 0);
  return {
    revenue,
    orders: orders.length,
    averageOrderValue: orders.length ? revenue / orders.length : 0,
    customers: new Set(orders.map((order) => order.customer)).size,
  };
}

export function getPreviousRange(range: DateRange): DateRange {
  const duration = toDay(range.end).getTime() - toDay(range.start).getTime();
  const previousEnd = new Date(toDay(range.start).getTime() - 86400000);
  return {
    start: new Date(previousEnd.getTime() - duration),
    end: previousEnd,
  };
}

export function calculateRevenueChange(current: Order[], previous: Order[]) {
  const currentRevenue = calculateKpis(current).revenue;
  const previousRevenue = calculateKpis(previous).revenue;
  if (!previousRevenue) return currentRevenue ? 100 : 0;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}

function aggregate(
  orders: Order[],
  key: (order: Order) => string,
  value: (order: Order) => number,
) {
  const totals = new Map<string, number>();
  orders.forEach((order) => {
    const name = key(order);
    totals.set(name, (totals.get(name) ?? 0) + value(order));
  });
  return Array.from(totals, ([name, total]) => ({ name, value: total }));
}

export function getDailyRevenue(orders: Order[]) {
  return aggregate(orders, (order) => order.date, revenueOf)
    .map(({ name, value }) => ({ date: name, revenue: value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getDailyRevenueForRange(orders: Order[], range: DateRange) {
  const revenueByDate = new Map(
    getDailyRevenue(orders).map((item) => [item.date, item.revenue]),
  );
  const result: Array<{ date: string; revenue: number }> = [];
  const cursor = toDay(range.start);
  const end = toDay(range.end);

  while (cursor <= end) {
    const date = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, "0"),
      String(cursor.getDate()).padStart(2, "0"),
    ].join("-");
    result.push({ date, revenue: revenueByDate.get(date) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

export function getCategoryOrders(orders: Order[]) {
  return aggregate(orders, (order) => order.category, () => 1)
    .sort((a, b) => b.value - a.value);
}

export function getTopProducts(orders: Order[], limit = 5) {
  return aggregate(orders, (order) => order.product, revenueOf)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getStatusDistribution(orders: Order[]) {
  return aggregate(orders, (order) => order.status, () => 1)
    .sort((a, b) => b.value - a.value);
}

export function getPresetRange(
  preset: "today" | "week" | "month",
  anchor = new Date(),
): DateRange {
  const end = toDay(anchor);
  const start = new Date(end);
  if (preset === "week") start.setDate(end.getDate() - 6);
  if (preset === "month") start.setDate(end.getDate() - 29);
  return { start, end };
}
