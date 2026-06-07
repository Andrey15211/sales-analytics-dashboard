export const ORDER_STATUSES = ["delivered", "processing", "cancelled", "returned"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  category: string;
  quantity: number;
  price: number;
  status: OrderStatus;
}

export const CSV_COLUMNS: Array<keyof Order> = [
  "id",
  "date",
  "customer",
  "product",
  "category",
  "quantity",
  "price",
  "status",
];
