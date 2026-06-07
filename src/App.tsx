import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  Database,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  RotateCcw,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { DashboardCharts } from "./components/charts/DashboardCharts";
import { CsvUpload } from "./components/dashboard/CsvUpload";
import { KpiCards } from "./components/dashboard/KpiCards";
import { OrdersTable } from "./components/table/OrdersTable";
import { demoOrders } from "./data/demoOrders";
import type { Order } from "./types/order";
import {
  calculateKpis,
  calculateRevenueChange,
  filterOrdersByRange,
  getPresetRange,
  getPreviousRange,
  type DateRange,
} from "./utils/analytics";
import { parseOrdersFile } from "./utils/csv";
import { getDictionary, type Locale } from "./i18n";
import "./app.css";

type Preset = "today" | "week" | "month" | "custom";

const iso = (date: Date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");

const rangeLabel = (range: DateRange, locale: Locale) => {
  const format = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  if (iso(range.start) === iso(range.end)) return format.format(range.start);
  return `${format.format(range.start)} — ${format.format(range.end)}`;
};

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => localStorage.getItem("metricflow-locale") === "en" ? "en" : "ru");
  const dictionary = getDictionary(locale);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [preset, setPreset] = useState<Preset>("month");
  const [range, setRange] = useState<DateRange>(() => getPresetRange("month", new Date(2026, 5, 7)));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentOrders = useMemo(
    () => filterOrdersByRange(orders, range.start, range.end),
    [orders, range],
  );
  const previousRange = useMemo(() => getPreviousRange(range), [range]);
  const previousOrders = useMemo(
    () => filterOrdersByRange(orders, previousRange.start, previousRange.end),
    [orders, previousRange],
  );
  const kpis = useMemo(() => calculateKpis(currentOrders), [currentOrders]);
  const change = useMemo(
    () => calculateRevenueChange(currentOrders, previousOrders),
    [currentOrders, previousOrders],
  );

  useEffect(() => {
    localStorage.setItem("metricflow-locale", locale);
    document.documentElement.lang = locale;
    document.title = dictionary.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dictionary.meta.description);
  }, [dictionary, locale]);

  const changeLocale = (nextLocale: Locale) => {
    setError("");
    setLocale(nextLocale);
  };

  const selectPreset = (next: Exclude<Preset, "custom">) => {
    setPreset(next);
    setRange(getPresetRange(next, new Date(2026, 5, 7)));
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const result = await parseOrdersFile(file, locale);
      if (result.errors.length) {
        setError(result.errors.slice(0, 2).join(" "));
        return;
      }
      setOrders(result.orders);
      setSourceName(file.name);
      const dates = result.orders.map((order) => order.date).sort();
      const end = new Date(`${dates[dates.length - 1]}T00:00:00`);
      setPreset("month");
      setRange(getPresetRange("month", end));
    } catch {
      setError(dictionary.errors.fileRead);
    } finally {
      setUploading(false);
    }
  };

  const resetDemo = () => {
    setOrders(demoOrders);
    setSourceName(null);
    setError("");
    selectPreset("month");
  };

  return (
    <div className="app-shell">
      <button className="mobile-menu" type="button" onClick={() => setSidebarOpen(true)} aria-label={dictionary.app.openMenu}>
        <Menu size={20} />
      </button>
      {sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label={dictionary.app.closeMenu} onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><BarChart3 size={21} /></span>
          <div><strong>MetricFlow</strong><span>{dictionary.app.salesAnalytics}</span></div>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label={dictionary.app.closeMenu}><X size={18} /></button>
        </div>
        <nav aria-label={dictionary.app.workspace}>
          <span className="nav-label">{dictionary.app.workspace}</span>
          <a className="active" href="#overview"><LayoutDashboard size={18} />{dictionary.app.overview}</a>
          <a href="#orders"><ShoppingCart size={18} />{dictionary.app.orders}</a>
          <a href="#charts"><BarChart3 size={18} />{dictionary.app.reports}</a>
          <a href="#source"><Database size={18} />{dictionary.app.sources}</a>
          <span className="nav-label nav-label--second">{dictionary.app.system}</span>
          <a href="#settings"><Settings size={18} />{dictionary.app.settings}</a>
          <a href="#help"><CircleHelp size={18} />{dictionary.app.help}</a>
        </nav>
        <div className="sidebar-note">
          <Database size={18} />
          <div><strong>{sourceName ?? dictionary.app.demoData}</strong><span>{orders.length} {dictionary.app.records}</span></div>
          {sourceName && <button type="button" onClick={resetDemo} aria-label={dictionary.app.resetDemo}><RotateCcw size={15} /></button>}
        </div>
        <button className="collapse-button" type="button"><PanelLeftClose size={17} />{dictionary.app.collapse}</button>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <h1>{dictionary.app.title}</h1>
            <p>{rangeLabel(range, locale)} · {dictionary.app.updatedNow}</p>
          </div>
          <div className="topbar-actions">
            <div className="period-control" role="group" aria-label={dictionary.periods.label}>
              {([
                ["today", dictionary.periods.today],
                ["week", dictionary.periods.week],
                ["month", dictionary.periods.month],
              ] as const).map(([value, label]) => (
                <button className={preset === value ? "active" : ""} type="button" key={value} onClick={() => selectPreset(value)}>{label}</button>
              ))}
              <label className={preset === "custom" ? "custom active" : "custom"}>
                <CalendarDays size={15} />
                <span>{dictionary.periods.custom}</span>
                <input
                  aria-label={dictionary.periods.startLabel}
                  type="date"
                  value={iso(range.start)}
                  onChange={(event) => {
                    setPreset("custom");
                    setRange((current) => ({ ...current, start: new Date(`${event.target.value}T00:00:00`) }));
                  }}
                />
              </label>
            </div>
            <div className="language-switch" role="group" aria-label={dictionary.localeControl.label}>
              {(["ru", "en"] as const).map((value) => (
                <button type="button" className={locale === value ? "active" : ""} onClick={() => changeLocale(value)} key={value}>
                  {dictionary.localeControl[value]}
                </button>
              ))}
            </div>
            <CsvUpload loading={uploading} onFile={handleFile} actionLabel={dictionary.upload.action} loadingLabel={dictionary.upload.loading} />
          </div>
        </header>

        {preset === "custom" && (
          <div className="custom-range">
            <label>{dictionary.periods.start} <input type="date" value={iso(range.start)} onChange={(event) => setRange((current) => ({ ...current, start: new Date(`${event.target.value}T00:00:00`) }))} /></label>
            <label>{dictionary.periods.end} <input type="date" value={iso(range.end)} min={iso(range.start)} onChange={(event) => setRange((current) => ({ ...current, end: new Date(`${event.target.value}T00:00:00`) }))} /></label>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <div><strong>{dictionary.errors.uploadTitle}</strong><span>{error}</span></div>
            <button type="button" onClick={() => setError("")} aria-label={dictionary.errors.close}><X size={17} /></button>
          </div>
        )}

        <KpiCards kpis={kpis} revenueChange={change} dictionary={dictionary} locale={locale} />
        <div id="charts"><DashboardCharts orders={currentOrders} range={range} dictionary={dictionary} locale={locale} /></div>
        <div id="orders"><OrdersTable orders={currentOrders} dictionary={dictionary} locale={locale} /></div>
        <footer className="page-footer">
          <span>MetricFlow · {dictionary.app.portfolio}</span>
          <span>{sourceName ?? dictionary.app.demoData} · {orders.length} {dictionary.app.rows}</span>
        </footer>
      </main>
    </div>
  );
}
