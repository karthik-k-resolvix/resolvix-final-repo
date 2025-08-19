import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Pricing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      {/* Pricing Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Honest Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees, no fake discounts, no bullshit promises. Just
              straightforward pricing for real customer support solutions.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Subscription */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Monthly Subscription
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Everything you need for consistent support
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $29.99
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      30 days of active subscription
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Up to 250 tickets resolved
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      AI-powered context understanding
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Real-time fraud detection
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Team collaboration tools
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      99.9% uptime guarantee
                    </span>
                  </div>
                </div>
<div className="absolute bottom-4 w-full items-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                  Start Monthly Plan
                </Button>
                </div>
              </div>
            </div>

            {/* Token Top-up */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Token Top-up
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Additional tickets when you need them
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $9.99
                    </span>
                    <span className="text-gray-600">/100 tickets</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      100 additional tickets
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Use when monthly limit is reached
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Same AI-powered features
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">Instant activation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">
                      Pay only when you need it
                    </span>
                    
                  </div>
                </div>
               <div className="absolute bottom-4 w-full items-center">
                <Button
                  variant="outline"
                  className=" border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium"
                >
                  Buy Token Top-up
                </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Questions? We've got answers.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens if I use all 250 tickets before the month ends?
                </h3>
                <p className="text-gray-600">
                  Simply purchase a token top-up for $9.99 to get 100 additional
                  tickets. No subscription changes needed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do unused tickets roll over to the next month?
                </h3>
                <p className="text-gray-600">
                  No, your monthly subscription resets to 250 tickets each
                  billing cycle. Token top-ups don't expire and carry over until
                  used.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel anytime. Your subscription remains active
                  until the end of your current billing period. Reach out to us at <b>support@resolvix.tech</b> for cancellation of subscription.
                </p>
              </div>
              {/* <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  We offer a 7-day free trial with 25 tickets so you can test
                  our service risk-free before committing to a subscription.
                </p>
              </div> */}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gray-900 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your customer support?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the businesses already using Resolvix to deliver
              exceptional customer experiences with AI-powered support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                  Start Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    <Footer/>

    </div>
  );
}
