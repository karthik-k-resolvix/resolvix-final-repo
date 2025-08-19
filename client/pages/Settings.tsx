import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Building,
  Phone,
  Save,
  Edit,
  Shield,
  Key,
} from "lucide-react";
import type { BrandContact } from "@/components/types";
import { getSession } from "@/components/session";
import { supabase } from "../supabaseClient";

// Normalize any row/cached object to always expose .email
const normalizeContact = (row: any): BrandContact => ({
  id: row?.id ?? null,
  first_name: row?.first_name ?? "",
  last_name: row?.last_name ?? "",
  email: row?.email ?? row?.brand_contact_email ?? "",
  company_name: row?.company_name ?? "",
  country_code: row?.country_code ?? "",
  phone_number: row?.phone_number ?? null,
});

type BrandInfo = {
  id?: number;
  brand_contact_email?: string;
  created_at?: string | null;
  last_login?: string | null;
  status?: string | null;
  subscription_plan?: string | null;
  // ...any other columns you may have
} | null;

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState<BrandContact | null>(null);

  // Edit buffer + saving flag
  const [formData, setFormData] = useState<BrandContact | null>(null);
  const [saving, setSaving] = useState(false);

  // Password change UI/state
  const [showPwdEditor, setShowPwdEditor] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  // Brands table info
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(null);
  const [brandLoading, setBrandLoading] = useState(false);

  // Deletion notice banner
  const [deletionRequested, setDeletionRequested] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      // 1) Try cached brand_contact
      const cached = getSession<any>("brand_contact");
      if (cached) {
        const norm = normalizeContact(cached);
        setContact(norm);
        setFormData(norm);
        sessionStorage.setItem("brand_contact", JSON.stringify(norm));
        if (norm.email) sessionStorage.setItem("brand_contact_email", norm.email);
        return;
      }

      // 2) Try fetching canonical row from Supabase using stored email
      const email =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("brand_contact_email")
          : null;

      if (email) {
        const { data, error } = await supabase
          .from("brand_contact")
          .select(
            "id, first_name, last_name, email, brand_contact_email, company_name, country_code, phone_number"
          )
          .or(`email.eq.${email},brand_contact_email.eq.${email}`)
          .maybeSingle();

        if (!error && data) {
          const norm = normalizeContact(data);
          window.sessionStorage.setItem("brand_contact", JSON.stringify(norm));
          if (norm.email) window.sessionStorage.setItem("brand_contact_email", norm.email);
          setContact(norm);
          setFormData(norm);
          return;
        } else if (error) {
          console.warn("[Settings] Supabase fetch error", error);
        }
      }

      // 3) Fallback: build minimal object from signupData so UI can render
      const signupRaw =
        typeof window !== "undefined"
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

          const norm = normalizeContact({
            first_name: s.firstName,
            last_name: s.lastName,
            email: s.email,
            company_name: s.companyName,
            country_code: s.countryCode,
            phone_number: s.phoneNumber ?? null,
          });

          setContact(norm);
          setFormData(norm);
          window.sessionStorage.setItem("brand_contact", JSON.stringify(norm));
          if (norm.email) window.sessionStorage.setItem("brand_contact_email", norm.email);
        } catch (e) {
          console.warn("[Settings] Failed to parse signupData", e);
        }
      }
    };

    hydrate();
  }, []);

  // Fetch brands table info once we know the email
  useEffect(() => {
    const fetchBrandInfo = async () => {
      setBrandLoading(true);
      try {
        const brandEmail =
          sessionStorage.getItem("brand_contact_email") ?? contact?.email ?? "";

        if (!brandEmail) {
          setBrandInfo(null);
          setBrandLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .eq("brand_contact_email", brandEmail);

        if (error) {
          console.warn("[Settings] brands fetch error", error);
          setBrandInfo(null);
        } else {
          setBrandInfo(data[0] ?? null);
          console.log(brandInfo);
        }
      } finally {
        setBrandLoading(false);
      }
    };

    fetchBrandInfo();
  }, [contact?.email]);

  // Keep edit buffer in sync if contact changes later
  useEffect(() => {
    if (contact) setFormData(contact);
  }, [contact]);

  // Map UI field names -> DB (snake_case) keys and update edit buffer
  const updateField = (field: string, value: string) => {
    if (field === "email") return; // email is not editable
    const keyMap: Record<string, keyof BrandContact> = {
      firstName: "first_name",
      lastName: "last_name",
      companyName: "company_name",
      phoneNumber: "phone_number",
      // countryCode if you add it later:
      // countryCode: "country_code",
    };
    const key = (keyMap[field] ?? field) as keyof BrandContact;
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);

    try {
      const oldEmail =
        contact?.email ??
        sessionStorage.getItem("brand_contact_email") ??
        null;

      if (!oldEmail) {
        alert("Missing profile email. Please sign in again.");
        setSaving(false);
        return;
      }

      // Do not send email in the payload since email is not editable
      const payload: Partial<BrandContact> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        phone_number: formData.phone_number ?? null,
      };

      // Try update by id if present, else by old email (note: using brand_contact_email per your current code)
      let q = supabase.from("brand_contact").update(payload);
      if (contact?.id) q = q.eq("id", contact.id);
      else q = q.eq("brand_contact_email", oldEmail);

      const { data: updatedArr, error: updErr } = await q.select("*"); // array result

      if (updErr) {
        console.error("[Settings] update error", updErr);
        alert("Failed to save changes: " + updErr.message);
        setSaving(false);
        return;
      }

      let updated = updatedArr?.[0] as BrandContact | undefined;

      // If no row matched, create it with the old email
      if (!updated) {
        const upsertPayload = { ...payload, email: oldEmail };
        const { data: upsertArr, error: upsertErr } = await supabase
          .from("brand_contact")
          .upsert(upsertPayload, { onConflict: "brand_contact_email" })
          .select("*");

        if (upsertErr) {
          console.error("[Settings] upsert error", upsertErr);
          alert("Failed to save changes: " + upsertErr.message);
          setSaving(false);
          return;
        }

        updated = upsertArr?.[0] as BrandContact | undefined;
      }

      if (!updated) {
        alert("Could not save changes. No row returned.");
        setSaving(false);
        return;
      }

      // Update state + cache
      const norm = normalizeContact(updated);
      setContact(norm);
      setFormData(norm);
      sessionStorage.setItem("brand_contact", JSON.stringify(norm));

      // Keep the brand_contact_email key stable (we do not overwrite an existing valid key)
      const currentKey = sessionStorage.getItem("brand_contact_email");
      if (!currentKey && norm.email) {
        sessionStorage.setItem("brand_contact_email", norm.email);
      }

      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  // ---- Change Password handlers ----
  const handlePasswordSave = async () => {
    if (!newPassword || newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    setPwdSaving(true);
    try {
      // Ensure user is logged in
      const { data: ures, error: uerr } = await supabase.auth.getUser();
      if (uerr || !ures?.user) {
        alert("You need to be signed in to change your password.");
        setPwdSaving(false);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        alert("Failed to change password: " + error.message);
        setPwdSaving(false);
        return;
      }

      // Clear editor, sign out, redirect
      setShowPwdEditor(false);
      setNewPassword("");
      await supabase.auth.signOut();
      window.location.href = "/"; // keep consistent with your logout pattern
    } finally {
      setPwdSaving(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPwdEditor(false);
    setNewPassword("");
  };

  const handleCancel = () => {
    setFormData(contact); // revert to last loaded contact
    setIsEditing(false);
  };

  // ---- Delete Account ----
  const handleDeleteAccount = () => {
    const email = contact?.email ?? sessionStorage.getItem("brand_contact_email") ?? "";
    const subject = encodeURIComponent("Delete account request");
    const body = encodeURIComponent(
      `Please delete the account associated with ${email}.\n\nI understand this will be processed within 48 hours.`
    );
    window.location.href = `mailto:karthik.k@resolvix.tech?subject=${subject}&body=${body}`;

    // Show confirmation banner in the UI
    setDeletionRequested(true);
  };

  // Helpers to format dates safely
  const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">

        {/* Optional confirmation banner for deletion */}
        {deletionRequested && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            The corresponding activity will be done in 48 hours. You can re-check for the same.
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and profile information
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h2>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData?.first_name ?? ""}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {contact?.first_name ?? ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData?.last_name ?? ""}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {contact?.last_name ?? ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={contact?.email ?? ""}
                      readOnly
                      disabled
                      className="w-full bg-gray-50 cursor-not-allowed"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{contact?.email ?? ""}</span>
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  {isEditing ? (
                    <Input
                      id="companyName"
                      value={contact?.company_name ?? ""}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {contact?.company_name ?? ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      value={formData?.phone_number ?? ""}
                      onChange={(e) => updateField("phoneNumber", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {contact?.phone_number ?? ""}
                      </span>
                    </div>
                  )}
                </div>

                
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Security
                </h2>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Password */}
              <div className="py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Password
                      </h3>
                      <p className="text-sm text-gray-500">
                        {showPwdEditor ? "Enter a new password and save." : "Last updated 3 months ago"}
                      </p>
                    </div>
                  </div>
                  {!showPwdEditor ? (
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => setShowPwdEditor(true)}
                    >
                      Change Password
                    </Button>
                  ) : null}
                </div>

                {showPwdEditor && (
                  <div className="mt-4 flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md"
                    />
                    <Button
                      onClick={handlePasswordSave}
                      disabled={pwdSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {pwdSaving ? "Saving…" : "Save"}
                    </Button>
                    <Button variant="outline" onClick={handlePasswordCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information (from brands) */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Last Login
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {brandLoading ? "Loading…" : fmtDate(brandInfo?.last_login ?? null)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Account Status
                  </Label>
                  <p className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {brandLoading ? "Loading…" : (brandInfo?.status ?? "Active")}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Subscription Plan
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {brandLoading ? "Loading…" : (brandInfo?.subscription_plan ?? "—")}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Danger Zone */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-red-200">
            <div className="px-6 py-4 border-b border-red-200">
              <h2 className="text-lg font-semibold text-red-900">
                Danger Zone
              </h2>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
