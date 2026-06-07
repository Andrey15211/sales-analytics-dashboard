import type { Order, OrderStatus } from "../types/order";

const catalog = [
  { product: "ProBook 14", category: "electronics", price: 129990 },
  { product: "UltraView 27 Monitor", category: "electronics", price: 46990 },
  { product: "Nova X Smartphone", category: "electronics", price: 79990 },
  { product: "AirBeat Headphones", category: "electronics", price: 18990 },
  { product: "Ergo Plus Chair", category: "furniture", price: 38990 },
  { product: "Workline Desk", category: "furniture", price: 32990 },
  { product: "Nordic Shelf", category: "furniture", price: 17990 },
  { product: "Barista Coffee Machine", category: "appliances", price: 54990 },
  { product: "CleanBot Robot Vacuum", category: "appliances", price: 42990 },
  { product: "AirCare Humidifier", category: "appliances", price: 9990 },
  { product: "City Pack Backpack", category: "accessories", price: 7990 },
  { product: "Focus Lamp", category: "accessories", price: 6490 },
] as const;

const customers = [
  "Anna Smirnova", "Mikhail Volkov", "Elena Sokolova", "Dmitry Orlov",
  "Olga Morozova", "Alexey Lebedev", "Maria Kuznetsova", "Ivan Popov",
  "Natalia Novikova", "Sergey Fedorov", "Tatiana Pavlova", "Roman Egorov",
  "Victoria Belova", "Artem Makarov", "Yulia Zakharova", "Pavel Vinogradov",
  "Ekaterina Gromova", "Nikolay Krylov", "Alina Tikhonova", "Maxim Komarov",
];

const statuses: OrderStatus[] = [
  "delivered", "delivered", "delivered", "delivered",
  "processing", "processing", "cancelled", "returned",
];

function dateBefore(daysAgo: number) {
  const date = new Date(2026, 5, 7);
  date.setDate(date.getDate() - daysAgo);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export const demoOrders: Order[] = Array.from({ length: 120 }, (_, index) => {
  const item = catalog[(index * 7 + 3) % catalog.length];
  const priceFactor = 1 + (((index * 13) % 9) - 4) / 100;
  return {
    id: `ORD-${String(10481 + index).padStart(5, "0")}`,
    date: dateBefore((index * 11 + index % 5) % 60),
    customer: customers[(index * 3 + 2) % customers.length],
    product: item.product,
    category: item.category,
    quantity: (index % 3) + 1,
    price: Math.round((item.price * priceFactor) / 10) * 10,
    status: statuses[(index * 5 + 1) % statuses.length],
  };
}).sort((a, b) => b.date.localeCompare(a.date));
