import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, Mail, LogOut, Menu, X, User } from "lucide-react";
// Removed: import { Session } from "inspector/promises";
import { getSession } from "@/components/session";
import type { BrandContact } from "@/components/types";
import { supabase } from "../supabaseClient";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [contact, setContact] = useState<BrandContact | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      // 1) Try cached brand_contact via helper
      const cached = getSession<BrandContact>("brand_contact");
      if (cached) {
        setContact(cached);
        return;
      }

      // 2) Fallback to signupData so the UI shows basic info immediately
      const signupRaw = typeof window !== "undefined"
        ? window.sessionStorage.getItem("signupData")
        : null;

      if (signupRaw) {
        try {
          const s = JSON.parse(signupRaw) as {
            firstName: string;
            lastName: string;
            email: string;
            companyName: string;
            countryCode: string;
            phoneNumber?: string | null;
          };

          const fallback: BrandContact = {
            first_name: s.firstName,
            last_name: s.lastName,
            email: s.email,
            company_name: s.companyName,
            country_code: s.countryCode,
            phone_number: s.phoneNumber ?? null,
          };

          setContact(fallback);
          window.sessionStorage.setItem("brand_contact", JSON.stringify(fallback));
          // Do not return, we can still improve with canonical row next
        } catch (e) {
          console.warn("[DashboardLayout] Failed to parse signupData", e);
        }
      }

      // 3) If we have an email, fetch the canonical row and cache it
      const email = typeof window !== "undefined"
        ? window.sessionStorage.getItem("brand_contact_email")
        : null;

      if (email) {
        const { data, error } = await supabase
          .from("brand_contact")
          .select("*")
          .eq("email", email)
          .single();

        if (!error && data) {
          window.sessionStorage.setItem("brand_contact", JSON.stringify(data));
          setContact(data as BrandContact);
        } else if (error) {
          console.warn("[DashboardLayout] Supabase fetch error", error);
        }
      }
    };

    hydrate();
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Email Management", href: "/dashboard/emails", icon: Mail },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  console.log(contact);

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
    // Redirect to home page or sign in
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <img src="/public/assets/Logo.png" width="50" height="60" />
                <span className="text-xl font-bold text-blue-600">
                  RESOLVIX
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-6 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile & Logout */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contact?.first_name || ""} {contact?.last_name || ""}
                    </p>
                    <p className="text-xs text-gray-500">{contact?.email || ""}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 flex z-40">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Mobile sidebar content */}
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-blue-600">
                    RESOLVIX
                  </span>
                </div>
                <nav className="px-4 space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile user profile */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contact?.first_name || ""} {contact?.last_name || ""}
                    </p>
                    <p className="text-xs text-gray-500">{contact?.email || ""}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="text-xl font-bold text-blue-600">RESOLVIX</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
