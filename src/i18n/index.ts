export type Locale = "ru" | "en";

const ru = {
  locale: "ru",
  meta: { title: "Аналитика продаж", description: "Интерактивная аналитика продаж и заказов" },
  app: {
    title: "Аналитика продаж", updatedNow: "данные обновлены сейчас", salesAnalytics: "Аналитика продаж",
    workspace: "Рабочая область", system: "Система", overview: "Обзор", orders: "Заказы",
    reports: "Отчеты", sources: "Источники", settings: "Настройки", help: "Помощь",
    demoData: "Демо-данные", records: "записей", rows: "строк", collapse: "Свернуть",
    openMenu: "Открыть меню", closeMenu: "Закрыть меню", resetDemo: "Вернуть демо-данные",
    portfolio: "Портфолио-кейс",
  },
  localeControl: { label: "Язык интерфейса", ru: "RU", en: "EN" },
  periods: {
    label: "Выбор периода", today: "Сегодня", week: "Неделя", month: "Месяц",
    custom: "Период", start: "С", end: "По", startLabel: "Начало периода",
  },
  upload: { action: "Загрузить CSV", loading: "Загрузка..." },
  kpis: {
    label: "Ключевые показатели", revenue: "Выручка", orders: "Заказы",
    averageOrderValue: "Средний чек", customers: "Клиенты", change: "Динамика",
    previousPeriod: "к предыдущему периоду",
  },
  charts: {
    label: "Графики продаж", revenueByDay: "Выручка по дням",
    revenueSubtitle: "Динамика продаж за выбранный период", categoryOrders: "Заказы по категориям",
    orderCount: "Количество заказов", topProducts: "Топ товаров", byRevenue: "По выручке",
    statuses: "Статусы заказов", statusSubtitle: "Распределение по состоянию",
    orders: "заказов", empty: "Нет данных за выбранный период", revenue: "Выручка",
    million: "млн", thousand: "тыс.",
  },
  table: {
    title: "Заказы", periodRecords: "записей за выбранный период", searchLabel: "Поиск заказов",
    searchPlaceholder: "Поиск по заказам...", categoryFilter: "Фильтр категории",
    allCategories: "Все категории", statusFilter: "Фильтр статуса", allStatuses: "Все статусы",
    id: "Заказ", date: "Дата", customer: "Клиент", product: "Товар", category: "Категория",
    quantity: "Кол-во", amount: "Сумма", status: "Статус", emptyTitle: "Заказы не найдены",
    emptyText: "Измените поисковый запрос или фильтры", shown: "Показано",
    of: "из", previousPage: "Предыдущая страница", nextPage: "Следующая страница",
  },
  statuses: {
    delivered: "Доставлен", processing: "В обработке", cancelled: "Отменен", returned: "Возврат",
  },
  categories: {
    electronics: "Электроника", furniture: "Мебель", appliances: "Бытовая техника", accessories: "Аксессуары",
  },
  errors: {
    uploadTitle: "CSV не загружен", fileRead: "Не удалось прочитать файл. Проверьте формат и повторите попытку.",
    csvRead: "Не удалось прочитать CSV", missingColumns: "Отсутствуют столбцы",
    emptyCsv: "CSV не содержит строк с данными.", row: "Строка", emptyField: "пустое поле",
    invalidDate: "дата должна быть в формате YYYY-MM-DD.",
    invalidQuantity: "quantity должно быть положительным целым числом.",
    invalidPrice: "price должно быть положительным числом.", invalidStatus: "недопустимый статус",
    close: "Закрыть сообщение",
  },
} as const;

type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

const en: DeepString<typeof ru> = {
  locale: "en",
  meta: { title: "Sales Analytics", description: "Interactive sales and order analytics" },
  app: {
    title: "Sales Analytics", updatedNow: "data updated just now", salesAnalytics: "Sales analytics",
    workspace: "Workspace", system: "System", overview: "Overview", orders: "Orders",
    reports: "Reports", sources: "Sources", settings: "Settings", help: "Help",
    demoData: "Demo data", records: "records", rows: "rows", collapse: "Collapse",
    openMenu: "Open menu", closeMenu: "Close menu", resetDemo: "Restore demo data",
    portfolio: "Portfolio case study",
  },
  localeControl: { label: "Interface language", ru: "RU", en: "EN" },
  periods: {
    label: "Select period", today: "Today", week: "Week", month: "Month",
    custom: "Range", start: "From", end: "To", startLabel: "Period start",
  },
  upload: { action: "Upload CSV", loading: "Loading..." },
  kpis: {
    label: "Key performance indicators", revenue: "Revenue", orders: "Orders",
    averageOrderValue: "Average order value", customers: "Customers", change: "Change",
    previousPeriod: "vs previous period",
  },
  charts: {
    label: "Sales charts", revenueByDay: "Revenue by day",
    revenueSubtitle: "Sales trend for the selected period", categoryOrders: "Orders by category",
    orderCount: "Number of orders", topProducts: "Top products", byRevenue: "By revenue",
    statuses: "Order statuses", statusSubtitle: "Distribution by status",
    orders: "orders", empty: "No data for the selected period", revenue: "Revenue",
    million: "M", thousand: "K",
  },
  table: {
    title: "Orders", periodRecords: "records for the selected period", searchLabel: "Search orders",
    searchPlaceholder: "Search orders...", categoryFilter: "Category filter",
    allCategories: "All categories", statusFilter: "Status filter", allStatuses: "All statuses",
    id: "Order", date: "Date", customer: "Customer", product: "Product", category: "Category",
    quantity: "Qty", amount: "Amount", status: "Status", emptyTitle: "No orders found",
    emptyText: "Change the search query or filters", shown: "Showing",
    of: "of", previousPage: "Previous page", nextPage: "Next page",
  },
  statuses: {
    delivered: "Delivered", processing: "Processing", cancelled: "Cancelled", returned: "Returned",
  },
  categories: {
    electronics: "Electronics", furniture: "Furniture", appliances: "Home appliances", accessories: "Accessories",
  },
  errors: {
    uploadTitle: "CSV was not uploaded", fileRead: "Could not read the file. Check its format and try again.",
    csvRead: "Could not parse CSV", missingColumns: "Missing columns",
    emptyCsv: "CSV contains no data rows.", row: "Row", emptyField: "empty field",
    invalidDate: "date must use the YYYY-MM-DD format.",
    invalidQuantity: "quantity must be a positive integer.",
    invalidPrice: "price must be a positive number.", invalidStatus: "unsupported status",
    close: "Close message",
  },
};

export const dictionaries = { ru, en } as const;
export type Dictionary = DeepString<typeof ru>;

export const getDictionary = (locale: Locale = "ru") => dictionaries[locale];

const statusAliases: Record<string, keyof Dictionary["statuses"]> = {
  "доставлен": "delivered", delivered: "delivered",
  "в обработке": "processing", processing: "processing",
  "отменен": "cancelled", "отменён": "cancelled", cancelled: "cancelled", canceled: "cancelled",
  "возврат": "returned", returned: "returned",
};

export function normalizeOrderStatus(value: string) {
  return statusAliases[value.trim().toLocaleLowerCase()] ?? null;
}
