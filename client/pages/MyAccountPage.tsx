import React from 'react';
import {
  UserIcon,
  UsersIcon,
  ClockIcon,
  CreditCardIcon,
  CpuChipIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

function NavItem({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${active ? 'bg-gray-100 font-semibold' : ''}`}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
}

function FormField({ label, defaultValue, placeholder, disabled }) {
  return (
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600">{label}</label>
      <input
        type="text"
        className="border rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600">Phone Number</label>
      <div className="flex items-center border rounded-md bg-gray-50 px-3 py-2">
        <img src="https://flagcdn.com/in.svg" alt="India" className="h-4 w-6 mr-2" />
        <span className="mr-2 text-gray-700">+91</span>
        <input type="tel" className="flex-1 bg-transparent outline-none" />
      </div>
    </div>
  );
}

export default function MyAccountPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FB] text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-8 py-4 bg-white">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Resolvix" className="h-8" />
          <span className="text-lg font-semibold">RESOLVIX</span>
        </div>
        <h1 className="text-xl font-semibold">My Account</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm hover:bg-gray-800">
            Dashboard <ArrowRightIcon className="h-4 w-4" />
          </a>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">R</div>
            <div className="text-sm font-medium">Rahul Reddy T</div>
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-semibold">ADMIN</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6">
          <nav className="flex flex-col gap-4 text-sm">
            <NavItem icon={UserIcon} label="Profile" active />
            <NavItem icon={UsersIcon} label="Team" active={undefined} />
            <NavItem icon={ClockIcon} label="History" active={undefined} />
            <NavItem icon={CreditCardIcon} label="Billing & Credits" active={undefined} />
            <NavItem icon={CpuChipIcon} label="AI Output"  active={undefined}/>
          </nav>
        </aside>

        {/* Form Panel */}
        <main className="flex-1 p-8">
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl">
            <div className="flex justify-end gap-6 mb-6 text-sm font-medium text-blue-600">
              <button>Change Password</button>
              <button>Edit Profile</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Full Name" defaultValue="Rahul Tikkavarapu" placeholder={undefined} disabled={undefined} />
              <FormField label="Company Name" defaultValue="AirBnB" placeholder={undefined} disabled={undefined} />
              <PhoneInput />
              <FormField label="GST No." placeholder="Enter GST number" disabled={undefined} defaultValue={undefined} />
              <FormField label="Email ID" placeholder={undefined} defaultValue="rahul@resolvix.com" disabled />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Icon */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button className="bg-[#003CFF] text-white p-4 rounded-full shadow-lg">
            <img src="/resolvix-logo-icon.svg" alt="Resolvix" className="h-6 w-6" />
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
        </div>
      </div>
    </div>
  );
}
