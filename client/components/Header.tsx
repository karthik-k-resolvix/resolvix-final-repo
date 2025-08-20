import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white px-6 py-4">
      {/* Header */}
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo or Icon */}
        <img src = "/assets/Logo.png" width="50" height="60"/>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/resources" className="text-gray-600 hover:text-gray-900">
            Resources
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
        </nav>

        {/* Sign In Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/signin"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
