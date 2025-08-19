import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail, Download } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">RESOLVIX</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Thank you for your purchase!
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
            Your subscription has been activated successfully. You're now ready
            to transform your customer support with AI-powered responses.
          </p>

          {/* Purchase Details */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Purchase Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan:</span>
                <span className="text-gray-900 font-medium">
                  Monthly Subscription
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-900 font-medium">$29.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tickets Included:</span>
                <span className="text-gray-900 font-medium">250 tickets</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Billing Cycle:</span>
                <span className="text-gray-900 font-medium">Monthly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Billing Date:</span>
                <span className="text-gray-900 font-medium">
                  February 25, 2025
                </span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What's next?
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Check your email for setup instructions</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Download className="w-5 h-5 text-blue-600" />
                <span>Download your receipt and invoice</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <span>Start adding your email accounts</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/dashboard/emails">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold text-lg"
              >
                Add Email Account
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Need help getting started?
              <Link
                to="/contact"
                className="text-blue-600 font-medium hover:underline ml-1"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-gray-600 text-sm mt-6">
          You can manage your subscription anytime from your dashboard settings.
        </p>
      </div>
    </div>
  );
}
