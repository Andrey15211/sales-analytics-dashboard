import {
  Banknote,
  ChartNoAxesCombined,
  CircleGauge,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import type { Kpis } from "../../utils/analytics";
import type { Dictionary, Locale } from "../../i18n";

type Props = {
  kpis: Kpis;
  revenueChange: number;
  dictionary: Dictionary;
  locale: Locale;
};

export function KpiCards({ kpis, revenueChange, dictionary, locale }: Props) {
  const localeCode = locale === "ru" ? "ru-RU" : "en-US";
  const rub = new Intl.NumberFormat(localeCode, { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
  const change = `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`;
  const items = [
    { key: "revenue", label: dictionary.kpis.revenue, value: rub.format(kpis.revenue), icon: Banknote, tone: "blue" },
    { key: "orders", label: dictionary.kpis.orders, value: kpis.orders.toLocaleString(localeCode), icon: ShoppingBag, tone: "violet" },
    { key: "aov", label: dictionary.kpis.averageOrderValue, value: rub.format(kpis.averageOrderValue), icon: CircleGauge, tone: "cyan" },
    { key: "customers", label: dictionary.kpis.customers, value: kpis.customers.toLocaleString(localeCode), icon: UsersRound, tone: "amber" },
    { key: "change", label: dictionary.kpis.change, value: change, icon: ChartNoAxesCombined, tone: revenueChange >= 0 ? "green" : "red" },
  ];

  return (
    <section className="kpi-grid" aria-label={dictionary.kpis.label}>
      {items.map(({ key, label, value, icon: Icon, tone }) => (
        <article className="card kpi-card animate-in" key={key}>
          <div className={`kpi-icon kpi-icon--${tone}`}><Icon size={20} strokeWidth={1.9} /></div>
          <div>
            <p>{label}</p>
            <strong>{value}</strong>
            {key === "change" && <small>{dictionary.kpis.previousPeriod}</small>}
          </div>
        </article>
      ))}
    </section>
  );
}
