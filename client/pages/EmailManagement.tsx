import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Plus,
  RotateCcw,
  CreditCard,
  Calendar,
  Ticket,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../supabaseClient"; // adjust path if needed
import type { PostgrestResponse } from "@supabase/supabase-js";

type AccountStatus = "active" | "expired" | "suspended";

interface EmailAccount {
  id: string;
  email: string; // brand_email_forwarder from brands
  status: AccountStatus; // from subscriptions
  subscriptionEnd: string; // from subscriptions.end_date
  ticketsUsed: number; // from subscriptions.tickets_used
  ticketsRemaining: number; // ticket_limit - tickets_used
  totalTickets: number; // ticket_limit
  dateAdded: string; // brands.created_at or onboarding_date
  forwarderEmail?: string | null; // keeps your second column (fallback to ai@resolvix.tech)
}

// Lightweight row shapes for typing
type BrandRowLight = {
  id?: string;
  idx?: number;
  brand_email_forwarder?: string | null;
  brand_contact_email?: string | null;
  created_at?: string | null;
  onboarding_date?: string | null;
  subscription_status?: boolean | string | number | null;
};

type SubscriptionRowLight = {
  id?: string;
  brand_email_forwarder?: string | null;
  forwarder_email?: string | null;
  status?: string | null;
  ticket_limit?: number | null;
  tickets_used?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  brand_contact_email?: string | null;
};

// ---- helpers ----
const toInt = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const toStr = (v: any, fb = "") =>
  v === null || v === undefined ? fb : String(v);

// Typed timeout helper (5s)
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

// pick the “best” subscription for a forwarder: prefer active, else most recently updated
const pickBestSubscription = (rows: SubscriptionRowLight[] = []) => {
  if (!rows.length) return null;
  const actives = rows.filter(
    (r) => (r.status ?? "").toLowerCase() === "active"
  );
  const base = actives.length ? actives : rows;
  const score = (r: SubscriptionRowLight) =>
    new Date(r.updated_at || r.start_date || r.created_at || 0).getTime();
  return base.sort((a, b) => score(b) - score(a))[0];
};

export default function EmailManagement() {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strict counters per your rules
  const [activeCountFromBrands, setActiveCountFromBrands] = useState(0);
  const [totalTicketsRemainingFromSubs, setTotalTicketsRemainingFromSubs] =
    useState(0);

  // Derived (kept for your UI; "Active Accounts" display will use activeCountFromBrands)
  const totalAccounts = useMemo(() => emailAccounts.length, [emailAccounts]);

  const brand_contact_email =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("brand_contact_email")
      : null;

  // Fetch brands + subscriptions and build UI data
  useEffect(() => {
    const fetchData = async () => {
      if (!brand_contact_email) {
        setError("User not identified. Please sign in or complete onboarding.");
        setLoading(false);
        return;
      }

      try {
        // --- brands ---
        const brandsRes = await sbTimeout<BrandRowLight>(
          supabase
            .from("brands")
            .select(
              "*" )
            .eq("brand_contact_email", brand_contact_email),
          5000
        );

        if (brandsRes.error) {
          console.error("[EmailManagement] brands fetch error:", brandsRes.error);
          setError("Failed to load email accounts.");
          setLoading(false);
          return;
        }

        const brandRows = (brandsRes.data ?? []) as BrandRowLight[];

        // distinct, non-empty forwarders
        const forwarders = Array.from(
          new Set(
            brandRows
              .map((b) =>
                toStr(b?.brand_email_forwarder, "").trim()
              )
              .filter((x) => !!x)
          )
        );

        // --- subscriptions ---
        const subsRes = await sbTimeout<SubscriptionRowLight>(
          supabase
            .from("subscriptions")
            .select(
              "id, brand_email_forwarder, forwarder_email, status, ticket_limit, tickets_used, start_date, end_date, created_at, updated_at, brand_contact_email"
            )
            .eq("brand_contact_email", brand_contact_email),
          5000
        );

        if (subsRes.error) {
          console.error(
            "[EmailManagement] subscriptions fetch error:",
            subsRes.error
          );
          // continue; we can still render with brands only
        }

        const subs = (subsRes.data ?? []) as SubscriptionRowLight[];

        // group subs by forwarder (brand_email_forwarder preferred; fallback forwarder_email)
        const subsByForwarder = new Map<string, SubscriptionRowLight[]>();
        for (const s of subs) {
          const fwd =
            toStr(s.brand_email_forwarder) || toStr(s.forwarder_email);
          if (!fwd) continue;
          const list = subsByForwarder.get(fwd) ?? [];
          list.push(s);
          subsByForwarder.set(fwd, list);
        }

        // Build accounts for table
        const accounts: EmailAccount[] = forwarders.map((fwd, i) => {
          const sub = pickBestSubscription(subsByForwarder.get(fwd) ?? []);
          const ticketLimit = toInt(sub?.ticket_limit, 0);
          const ticketsUsed = toInt(sub?.tickets_used, 0);
          const ticketsRemaining = Math.max(0, ticketLimit - ticketsUsed);

          const bRow =
            brandRows.find((b) => toStr(b?.brand_email_forwarder) === fwd) ??
            {};

          const dateAdded =
            toStr(bRow?.created_at) || toStr(bRow?.onboarding_date) || "";

          const rawStatus = toStr(sub?.status).toLowerCase();
          const status: AccountStatus =
            rawStatus === "active" || rawStatus === "suspended"
              ? (rawStatus as AccountStatus)
              : "expired";

          return {
            id: toStr(bRow?.id) || toStr(bRow?.idx) || `${fwd}-${i}`,
            email: fwd, // requirement #3
            status, // requirement #4
            subscriptionEnd: toStr(sub?.end_date, ""), // requirement #5
            ticketsUsed, // requirement #6
            ticketsRemaining, // requirement #7
            totalTickets: ticketLimit,
            dateAdded,
            forwarderEmail: "ai@resolvix.tech",
          };
        });

        setEmailAccounts(accounts);

        // #1 Active accounts from brands.subscription_status === TRUE
        const activeCount = brandRows.filter((b) => {
          const v = b.subscription_status;
          return v === true || v === "TRUE" || v === 1;
        }).length;
        setActiveCountFromBrands(activeCount);

        // #2 Total tickets remaining: sum over ACTIVE subscriptions for this contact
        const totalRemain = subs
          .filter((s) => toStr(s.status).toLowerCase() === "active")
          .reduce((sum, s) => {
            const lim = toInt(s.ticket_limit, 0);
            const used = toInt(s.tickets_used, 0);
            return sum + Math.max(0, lim - used);
          }, 0);
        setTotalTicketsRemainingFromSubs(totalRemain);
      } catch (e) {
        console.error("[EmailManagement] Unexpected error:", e);
        setError("Unexpected error while loading accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brand_contact_email]);

  const handleRenewSubscription = async (emailId: string) => {
    try {
      const fd = new FormData();
      fd.append("brand_email_forwarder", emailId);

      const res = await fetch(
        "https://n8n.srv756188.hstgr.cloud/webhook/0c9179ea-a908-406d-80c1-3740c39348c2",
        {
          method: "POST",
          body: fd,
        }
      );

      const text = await res.text();

      let redirectUrl: any;
      try {
        redirectUrl = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", text, parseErr);
        alert("Received malformed response from server.");
        return;
      }

      if (res.ok && redirectUrl?.short_url) {
        window.location.href = redirectUrl.short_url;
      } else {
        console.warn("Renew subscription failed:", redirectUrl);
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("Something went wrong while submitting.");
    }
  };

  const handleSubscription = async (emailId: string) => {
    try {
      const fd = new FormData();
      fd.append("brand_email_forwarder", emailId);

      const res = await fetch(
        "https://n8n.srv756188.hstgr.cloud/webhook/1d1725bd-f9d4-4979-a9d3-be53d115c57d",
        {
          method: "POST",
          body: fd,
        }
      );

      const text = await res.text();

      let redirectUrl: any;
      try {
        redirectUrl = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", text, parseErr);
        alert("Received malformed response from server.");
        return;
      }

      if (res.ok && redirectUrl?.short_url) {
        window.location.href = redirectUrl.short_url;
      } else {
        console.warn("Renew subscription failed:", redirectUrl);
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("Something went wrong while submitting.");
    }
  };

  const handleTopUpTickets = async (emailId: string) => {
    try {
      const fd = new FormData();
      fd.append("brand_email_forwarder", emailId);

      const res = await fetch(
        "https://n8n.srv756188.hstgr.cloud/webhook/ff3ae051-b4a5-4365-864f-a22be567ebf6",
        {
          method: "POST",
          body: fd,
        }
      );

      const text = await res.text();

      let redirectUrl: any;
      try {
        redirectUrl = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", text, parseErr);
        alert("Received malformed response from server.");
        return;
      }

      if (res.ok && redirectUrl[0]?.short_url) {
        window.location.href = redirectUrl[0].short_url;
      } else {
        console.warn("Top Up failed:", redirectUrl);
        console.log(redirectUrl);
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("Something went wrong while submitting.");
    }
  };

  const handleDeleteAccount = (emailId: string) => {
    console.log("Deleting email account:", emailId);
    // Optionally implement actual update/delete here:
    // return supabase
    //   .from("brands")
    //   .update({ is_delete: true })
    //   .eq("brand_email_forwarder", emailId)
    //   .eq("brand_contact_email", brand_contact_email);
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "suspended":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading email accounts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Email Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your customer support email accounts and their AI-powered
                responses
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <Link to="/register?demo=true">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Signup for Demo
                </Button>              
              </Link>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Email
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Email Accounts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAccounts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Accounts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCountFromBrands /* strictly from brands.subscription_status === TRUE */}
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Ticket className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Tickets Remaining
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTicketsRemainingFromSubs /* sum over ACTIVE subscriptions */}
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Email Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Email Accounts
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forwarder Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {account.email /* from brands.brand_email_forwarder */}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-sm text-gray-700">
                          {account.forwarderEmail ?? "ai@resolvix.tech"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(account.status)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {account.subscriptionEnd || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                account.totalTickets
                                  ? (account.ticketsUsed / account.totalTickets) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {account.ticketsUsed}/{account.totalTickets}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          account.ticketsRemaining > 50
                            ? "text-green-600"
                            : account.ticketsRemaining > 20
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {account.ticketsRemaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleRenewSubscription(account.email)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Renew
                        </Button>
                        <Button
                          onClick={() => handleTopUpTickets(account.email)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Top Up
                        </Button>
                        {/* <Button
                          onClick={() => handleDeleteAccount(account.email)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button> */}
                          <Button
                          onClick={() => handleSubscription(account.email)}
                          size="sm"
                          className="text-blue-200 border-blue-200 hover:bg-blue-50"
                        >
                          Subscribe
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {emailAccounts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No email accounts yet. Click{" "}
                      <span className="font-semibold">Add New Email</span> to get started.
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
