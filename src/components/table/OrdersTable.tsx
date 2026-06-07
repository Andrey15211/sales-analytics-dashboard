import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table";
import type { Order } from "../../types/order";
import type { Dictionary, Locale } from "../../i18n";

const columnHelper = createColumnHelper<Order>();

const globalFilter: FilterFn<Order> = (row, _columnId, value) => {
  const search = String(value).toLocaleLowerCase("ru");
  return [row.original.id, row.original.customer, row.original.product]
    .some((field) => field.toLocaleLowerCase("ru").includes(search));
};

const statusClass: Record<Order["status"], string> = {
  delivered: "status status--success", processing: "status status--progress",
  cancelled: "status status--cancelled", returned: "status status--return",
};

export function OrdersTable({ orders, dictionary, locale }: { orders: Order[]; dictionary: Dictionary; locale: Locale }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => orders.filter((order) =>
    (category === "all" || order.category === category) &&
    (status === "all" || order.status === status)
  ), [orders, category, status]);

  const localeCode = locale === "ru" ? "ru-RU" : "en-US";
  const rub = useMemo(() => new Intl.NumberFormat(localeCode, { style: "currency", currency: "RUB", maximumFractionDigits: 0 }), [localeCode]);
  const date = useMemo(() => new Intl.DateTimeFormat(localeCode, { day: "2-digit", month: "short", year: "numeric" }), [localeCode]);
  const categoryLabel = (value: string) => dictionary.categories[value as keyof Dictionary["categories"]] ?? value;
  const categories = useMemo(() => Array.from(new Set(orders.map((order) => order.category))).sort(), [orders]);
  const statuses = useMemo(() => Array.from(new Set(orders.map((order) => order.status))).sort(), [orders]);

  const columns = useMemo(() => [
    columnHelper.accessor("id", { header: dictionary.table.id, cell: (info) => <strong className="order-id">{info.getValue()}</strong> }),
    columnHelper.accessor("date", { header: dictionary.table.date, cell: (info) => date.format(new Date(`${info.getValue()}T00:00:00`)) }),
    columnHelper.accessor("customer", { header: dictionary.table.customer }),
    columnHelper.accessor("product", { header: dictionary.table.product }),
    columnHelper.accessor("category", { header: dictionary.table.category, cell: (info) => categoryLabel(info.getValue()) }),
    columnHelper.accessor("quantity", { header: dictionary.table.quantity }),
    columnHelper.accessor("price", { header: dictionary.table.amount, cell: (info) => rub.format(info.row.original.price * info.row.original.quantity) }),
    columnHelper.accessor("status", { header: dictionary.table.status, cell: (info) => <span className={statusClass[info.getValue()]}>{dictionary.statuses[info.getValue()]}</span> }),
  ], [date, dictionary, rub]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    globalFilterFn: globalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const start = table.getRowCount() ? table.getState().pagination.pageIndex * 10 + 1 : 0;
  const end = Math.min(start + 9, table.getRowCount());

  return (
    <section className="card table-card">
      <header className="table-heading">
        <div><h2>{dictionary.table.title}</h2><p>{orders.length} {dictionary.table.periodRecords}</p></div>
        <div className="table-tools">
          <label className="search-field">
            <Search size={17} />
            <span className="sr-only">{dictionary.table.searchLabel}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={dictionary.table.searchPlaceholder} />
          </label>
          <label className="select-field">
            <span className="sr-only">{dictionary.table.categoryFilter}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">{dictionary.table.allCategories}</option>
              {categories.map((item) => <option key={item} value={item}>{categoryLabel(item)}</option>)}
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="select-field">
            <span className="sr-only">{dictionary.table.statusFilter}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">{dictionary.table.allStatuses}</option>
              {statuses.map((item) => <option key={item} value={item}>{dictionary.statuses[item]}</option>)}
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
      </header>

      <div className="table-scroll scrollbar-thin">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <button type="button" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ChevronsUpDown size={13} className={header.column.getIsSorted() ? "sorted" : ""} />
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!table.getRowModel().rows.length && (
          <div className="table-empty">
            <Search size={24} />
            <strong>{dictionary.table.emptyTitle}</strong>
            <span>{dictionary.table.emptyText}</span>
          </div>
        )}
      </div>

      <footer className="table-footer">
        <span>{dictionary.table.shown} {start}–{end} {dictionary.table.of} {table.getRowCount()}</span>
        <div>
          <button type="button" aria-label={dictionary.table.previousPage} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft size={17} /></button>
          <span>{table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}</span>
          <button type="button" aria-label={dictionary.table.nextPage} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight size={17} /></button>
        </div>
      </footer>
    </section>
  );
}
