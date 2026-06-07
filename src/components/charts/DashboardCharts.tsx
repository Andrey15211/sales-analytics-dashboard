import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Order } from "../../types/order";
import type { Dictionary, Locale } from "../../i18n";
import {
  getCategoryOrders,
  getDailyRevenueForRange,
  getStatusDistribution,
  getTopProducts,
  type DateRange,
} from "../../utils/analytics";

const rubShort = (value: number, dictionary: Dictionary) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} ${dictionary.charts.million}`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} ${dictionary.charts.thousand}`;
  return String(value);
};

const dateShort = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T00:00:00`),
  );

const tooltipStyle = {
  border: "1px solid #e6eaf0",
  borderRadius: 10,
  boxShadow: "0 8px 28px rgba(28, 39, 60, .1)",
  fontSize: 12,
};

function ChartEmpty({ text }: { text: string }) {
  return <div className="chart-empty">{text}</div>;
}

type Props = { orders: Order[]; range: DateRange; dictionary: Dictionary; locale: Locale };

export function DashboardCharts({ orders, range, dictionary, locale }: Props) {
  const daily = getDailyRevenueForRange(orders, range);
  const categories = getCategoryOrders(orders);
  const products = getTopProducts(orders);
  const statuses = getStatusDistribution(orders);
  const statusColors: Record<Order["status"], string> = {
    delivered: "#2563eb", processing: "#7c3aed", cancelled: "#f59e0b", returned: "#ef4444",
  };
  const categoryLabel = (value: string) =>
    dictionary.categories[value as keyof Dictionary["categories"]] ?? value;
  const statusLabel = (value: string) =>
    dictionary.statuses[value as keyof Dictionary["statuses"]] ?? value;

  return (
    <section className="charts-grid" aria-label={dictionary.charts.label}>
      <article className="card chart-card chart-card--revenue">
        <header className="card-header">
          <div><h2>{dictionary.charts.revenueByDay}</h2><p>{dictionary.charts.revenueSubtitle}</p></div>
          <span className="chart-unit">₽</span>
        </header>
        <div className="chart-main">
          {!daily.length ? <ChartEmpty text={dictionary.charts.empty} /> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily} margin={{ top: 12, right: 10, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf0f5" />
                <XAxis dataKey="date" tickFormatter={(value) => dateShort(value, locale)} axisLine={false} tickLine={false} tick={{ fill: "#8992a5", fontSize: 11 }} minTickGap={28} />
                <YAxis tickFormatter={(value) => rubShort(value, dictionary)} axisLine={false} tickLine={false} tick={{ fill: "#8992a5", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(value) => dateShort(String(value), locale)} formatter={(value) => [`${Number(value).toLocaleString(locale === "ru" ? "ru-RU" : "en-US")} ₽`, dictionary.charts.revenue]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="card chart-card">
        <header className="card-header"><div><h2>{dictionary.charts.categoryOrders}</h2><p>{dictionary.charts.orderCount}</p></div></header>
        <div className="chart-small">
          {!categories.length ? <ChartEmpty text={dictionary.charts.empty} /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickFormatter={categoryLabel} axisLine={false} tickLine={false} width={105} tick={{ fill: "#566176", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f4f6fa" }} />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="card chart-card">
        <header className="card-header"><div><h2>{dictionary.charts.topProducts}</h2><p>{dictionary.charts.byRevenue}</p></div></header>
        <div className="product-bars">
          {!products.length ? <ChartEmpty text={dictionary.charts.empty} /> : products.map((product, index) => (
            <div className="product-row" key={product.name}>
              <div><span>{index + 1}</span><p title={product.name}>{product.name}</p></div>
              <strong>{rubShort(product.value, dictionary)} ₽</strong>
              <i style={{ width: `${(product.value / products[0].value) * 100}%` }} />
            </div>
          ))}
        </div>
      </article>

      <article className="card chart-card">
        <header className="card-header"><div><h2>{dictionary.charts.statuses}</h2><p>{dictionary.charts.statusSubtitle}</p></div></header>
        <div className="status-chart">
          {!statuses.length ? <ChartEmpty text={dictionary.charts.empty} /> : (
            <>
              <div className="pie-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statuses} dataKey="value" innerRadius={47} outerRadius={67} paddingAngle={3} stroke="none">
                      {statuses.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name as Order["status"]]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => [Number(value), statusLabel(String(name))]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-total"><strong>{orders.length}</strong><span>{dictionary.charts.orders}</span></div>
              </div>
              <div className="legend">
                {statuses.map((status) => (
                  <div key={status.name}><i style={{ background: statusColors[status.name as Order["status"]] }} /><span>{statusLabel(status.name)}</span><strong>{status.value}</strong></div>
                ))}
              </div>
            </>
          )}
        </div>
      </article>
    </section>
  );
}
