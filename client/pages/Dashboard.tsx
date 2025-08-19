import { useState, useEffect, useMemo, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Mail,
  Filter,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import type { PostgrestResponse } from "@supabase/supabase-js";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface TicketRow {
  ticket_id: string;
  brand_customer_id: string | null;
  complaint_summary: string | null;
  severity_tier: string | null;
  ticket_timestamp: string;
  brand_name: string | null;
  brand_email_forwarder: string | null;
}

type BrandRowLight = {
  brand_email_forwarder?: string | null;
  brand_contact_email?: string | null;
};

type BrandTicketReport = {
  report_month?: string | null; // e.g. "2025-05-01"
  brand_contact_email?: string | null;
  brand_email_forwarder?: string | null;
  tickets_last_30_days?: number | string | null;
  fraud_suspected_tickets?: number | string | null;
  repeat_offender_tickets?: number | string | null;
  repeat_customers?: number | string | null;
  ticket_volume_growth_percent?: number | string | null;
};

const toInt = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const toStr = (v: any, fb = "") =>
  v === null || v === undefined ? fb : String(v);

async function sbTimeout<T>(
  qb: PromiseLike<PostgrestResponse<T>>,
  ms = 5000
): Promise<PostgrestResponse<T>> {
  return await Promise.race([
    qb as Promise<PostgrestResponse<T>>,
    new Promise<PostgrestResponse<T>>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout after 5000ms")), ms)
    ),
  ]);
}

// last 6 months including current, as "YYYY-MM"
const getLastSixMonths = () => {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    months.push(ym);
  }
  return months;
};

export default function Dashboard() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const monthOptions = useMemo(() => {
    return getLastSixMonths().map((ym) => {
      const [year, month] = ym.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      return {
        value: ym,
        label: date.toLocaleString("default", { month: "short", year: "numeric" }),
      };
    });
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const opts = getLastSixMonths();
    return opts[opts.length - 1];
  });
  const [selectedEmail, setSelectedEmail] = useState("all");

  const [forwarders, setForwarders] = useState<string[]>([]);

  const [ticketData, setTicketData] = useState({
    totalTickets: 0,
    fraudSuspected: 0,
    repeatCustomers: 0,
    ticketVolumeGrowth: "0%",
    monthlyChange: "0%",
    resolutionRate: "0%",
  });

  // For charts
  const [monthlyTickets, setMonthlyTickets] = useState<
    { month: string; tickets: number }[]
  >([]);
  const [fraudTrend, setFraudTrend] = useState<
    { month: string; fraud: number; repeat: number }[]
  >([]);

  const [recentTickets, setRecentTickets] = useState<
    {
      id: string;
      email: string;
      subject: string;
      status: string;
      time: string;
      brand: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brand_contact_email =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("brand_contact_email")
      : null;

  // 1) Load forwarders for this contact (brands)
  useEffect(() => {
    const loadForwarders = async () => {
      if (!brand_contact_email) return;

      try {
        const res = await sbTimeout<BrandRowLight>(
          supabase
            .from("brands")
            .select("brand_email_forwarder, brand_contact_email")
            .eq("brand_contact_email", brand_contact_email),
          5000
        );

        if (res.error) {
          console.error("[Dashboard] brands error:", res.error);
          return;
        }

        const rows = (res.data ?? []) as BrandRowLight[];
        const fwd = Array.from(
          new Set(
            rows
              .map((r) => toStr(r.brand_email_forwarder).trim())
              .filter(Boolean)
          )
        );
        setForwarders(fwd);
      } catch (e) {
        console.error("[Dashboard] brands exception:", e);
      }
    };

    loadForwarders();
  }, [brand_contact_email]);

  // 2) Load brand_ticket_reports + recent tickets when month/email changes
  useEffect(() => {
    const fetchData = async () => {
      if (!brand_contact_email) {
        setError("User not identified. Please sign in or complete onboarding.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // --- brand_ticket_reports for this contact (one shot; filter client-side) ---
        const reportsRes = await sbTimeout<BrandTicketReport>(
          supabase
            .from("brand_ticket_reports")
            .select(
              "report_month, brand_contact_email, brand_email_forwarder, tickets_last_30_days, fraud_suspected_tickets, repeat_offender_tickets, repeat_customers, ticket_volume_growth_percent"
            )
            .eq("brand_contact_email", brand_contact_email),
          5000
        );

        if (reportsRes.error) {
          console.error("[Dashboard] brand_ticket_reports error:", reportsRes.error);
          setError("Failed to load ticket data.");
          setLoading(false);
          return;
        }

        const reports = (reportsRes.data ?? []) as BrandTicketReport[];

        // Parse report_month to "YYYY-MM"
        const ymOf = (rm?: string | null) => {
          if (!rm) return "";
          const d = new Date(rm);
          if (isNaN(d.getTime())) return "";
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        };

        const matchEmail = (r: BrandTicketReport) => {
          if (selectedEmail === "all") return true;
          const be = toStr(r.brand_email_forwarder).trim();
          return be === selectedEmail;
        };

        // Stats cards for selectedMonth + selectedEmail (sum across matching rows)
        const monthReports = reports.filter(
          (r) => ymOf(r.report_month) === selectedMonth && matchEmail(r)
        );

        const sumNum = (
          rows: BrandTicketReport[],
          key: keyof BrandTicketReport
        ) => rows.reduce((acc, row) => acc + toInt(row[key]), 0);

        const totalTickets = sumNum(monthReports, "tickets_last_30_days");
        const fraudSuspected = sumNum(monthReports, "fraud_suspected_tickets");
        const repeatCustomers = sumNum(monthReports, "repeat_customers");

        // ticket_volume_growth_percent → if multiple rows, average it
        const tvgVals = monthReports.map((r) =>
          Number(r.ticket_volume_growth_percent)
        );
        const tvg =
          tvgVals.length > 0
            ? (tvgVals.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0) /
                tvgVals.length)
                .toFixed(1) + "%"
            : "0%";

        // monthlyChange: compare current selectedMonth vs prev month using tickets_last_30_days
        const [currY, currM] = selectedMonth.split("-").map(Number);
        const prevDate = new Date(currY, currM - 1 - 1, 1);
        const prevYM = `${prevDate.getFullYear()}-${String(
          prevDate.getMonth() + 1
        ).padStart(2, "0")}`;

        const prevReports = reports.filter(
          (r) => ymOf(r.report_month) === prevYM && matchEmail(r)
        );
        const prevTotal = sumNum(prevReports, "tickets_last_30_days");
        let monthlyChange = "0%";
        if (prevTotal > 0) {
          const change = ((totalTickets - prevTotal) / prevTotal) * 100;
          monthlyChange = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
        }

        setTicketData({
          totalTickets,
          fraudSuspected,
          repeatCustomers,
          ticketVolumeGrowth: tvg,
          monthlyChange,
          resolutionRate: "0%",
        });

        // Monthly ticket trends for the last 6 months (tickets_last_30_days)
        const monthlyTrend = getLastSixMonths().map((ym) => {
          const rows = reports.filter(
            (r) => ymOf(r.report_month) === ym && matchEmail(r)
          );
          const sum = sumNum(rows, "tickets_last_30_days");
          // label "Aug", etc
          const [y, m] = ym.split("-").map(Number);
          const d = new Date(y, m - 1);
          const label = d.toLocaleString("default", { month: "short" });
          return { month: label, tickets: sum };
        });
        setMonthlyTickets(monthlyTrend);

        // Fraud & Repeat offenders trend across last 6 months (selected email or aggregated)
        const fraudSeries = getLastSixMonths().map((ym) => {
          const rows = reports.filter(
            (r) => ymOf(r.report_month) === ym && matchEmail(r)
          );
          const fraud = sumNum(rows, "fraud_suspected_tickets");
          const repeat = sumNum(rows, "repeat_offender_tickets");
          const [y, m] = ym.split("-").map(Number);
          const d = new Date(y, m - 1);
          const label = d.toLocaleString("default", { month: "short" });
          return { month: label, fraud, repeat };
        });
        setFraudTrend(fraudSeries);

        // Recent Tickets: last 5 by ticket_timestamp
        let ticketsRes: PostgrestResponse<TicketRow>;
        if (selectedEmail !== "all") {
          ticketsRes = await sbTimeout<TicketRow>(
            supabase
              .from("tickets")
              .select(
                "ticket_id, brand_customer_id, complaint_summary, severity_tier, ticket_timestamp, brand_name, brand_email_forwarder"
              )
              .eq("brand_email_forwarder", selectedEmail)
              .order("ticket_timestamp", { ascending: false })
              .limit(5),
            5000
          );
        } else {
          const base = supabase
            .from("tickets")
            .select(
              "ticket_id, brand_customer_id, complaint_summary, severity_tier, ticket_timestamp, brand_name, brand_email_forwarder"
            )
            .order("ticket_timestamp", { ascending: false })
            .limit(5);

          ticketsRes =
            forwarders.length > 0
              ? await sbTimeout<TicketRow>(
                  base.in("brand_email_forwarder", forwarders),
                  5000
                )
              : await sbTimeout<TicketRow>(base, 5000);
        }

        if (ticketsRes.error) {
          console.error("[Dashboard] tickets error:", ticketsRes.error);
        }

        const trows = (ticketsRes.data ?? []) as unknown as TicketRow[];
        const recent = trows.map((t) => ({
          id: t.ticket_id,
          email: toStr(t.brand_customer_id, "—"),
          subject: toStr(t.complaint_summary, "—"),
          status: toStr(t.severity_tier, "—"),
          time: toStr(t.ticket_timestamp, "—"),
          brand: toStr(t.brand_name, "—"),
        }));

        setRecentTickets(recent);
      } catch (e) {
        console.error("[Dashboard] fetch exception:", e);
        setError("Unexpected error while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brand_contact_email, selectedMonth, selectedEmail, forwarders.length]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600 font-semibold">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Everything inside this wrapper is included in Export (left menu is outside) */}
      <div ref={contentRef} className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Overview of your customer support tickets and performance metrics
              </p>
            </div>
            {/* Re-enable later if you add export again */}
            {/* <div className="mt-4 sm:mt-0">
              <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div> */}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month-filter">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((mo) => (
                    <SelectItem key={mo.value} value={mo.value}>
                      {mo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-filter">Email Account</Label>
              <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {forwarders.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ticketData.totalTickets}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {ticketData.monthlyChange}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Fraud Suspected Tickets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {ticketData.fraudSuspected}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Repeat Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ticketData.repeatCustomers}
                </p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Ticket Volume Growth
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {ticketData.ticketVolumeGrowth}
                </p>
                <p className="text-sm text-gray-600">Selected month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Ticket Trends (Bar Chart) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Ticket Trends
            </h3>
            {monthlyTickets.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTickets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tickets" name="Tickets (last 30 days)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Fraud & Repeat Offenders Trend (Line Chart) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fraud &amp; Repeat Offenders Trend
              {selectedEmail !== "all" ? (
                <span className="text-sm text-gray-500"> — {selectedEmail}</span>
              ) : (
                <span className="text-sm text-gray-500"> — All Accounts</span>
              )}
            </h3>
            {fraudTrend.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fraudTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fraud" name="Fraud suspected" stroke="#8884d8" />
                    <Line type="monotone" dataKey="repeat" name="Repeat offenders" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {t.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.brand}
                    </td>
                  </tr>
                ))}
                {recentTickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                     Coming soon.....
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
