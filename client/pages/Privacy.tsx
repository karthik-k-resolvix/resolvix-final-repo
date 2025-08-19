import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, FileText } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
   <Header/>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy & Terms of Service
            </h1>
            <p className="text-xl text-gray-600">
              Your privacy and data security are of utmost importance to us
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: August 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Privacy Policy Section */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Privacy Policy
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Information We Collect
                  </h3>
                  <p>
                    We collect information you provide directly to us, such as
                    when you create an account, use our services, or communicate
                    with us. This may include your name, email address, company
                    information, and customer support communications that you
                    forward to our AI system.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How We Use Your Information
                  </h3>
                  <p>
                    We use the information we collect to provide, maintain, and
                    improve our AI-powered customer support services. This
                    includes analyzing customer communications to generate
                    insights, recommendations, and draft responses. We do not
                    share your customer data with third parties for their own
                    marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Data Security
                  </h3>
                  <p>
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                    All data is encrypted in transit and at rest using
                    industry-standard encryption protocols.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Data Retention
                  </h3>
                  <p>
                    We retain your personal information for as long as necessary
                    to provide our services and fulfill the purposes outlined in
                    this policy. Customer support communications are retained
                    only as long as needed to provide AI analysis and
                    recommendations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Your Rights
                  </h3>
                  <p>
                    You have the right to access, update, or delete your
                    personal information. You may also request that we stop
                    processing your data or provide you with a copy of your data
                    in a portable format. Contact us at support@resolvix.tech to
                    exercise these rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Cookies and Tracking
                  </h3>
                  <p>
                    We use cookies and similar technologies to improve your
                    experience on our website, analyze usage patterns, and
                    provide personalized content. You can control cookie
                    settings through your browser preferences.
                  </p>
                </div>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section className="mb-12 border-t border-gray-200 pt-12">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Terms of Service
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Acceptance of Terms
                  </h3>
                  <p>
                    By accessing and using Resolvix's services, you accept and
                    agree to be bound by the terms and provision of this
                    agreement. If you do not agree to abide by the above, please
                    do not use this service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Service Description
                  </h3>
                  <p>
                    Resolvix provides AI-powered customer support analysis and
                    response generation services. Our service analyzes customer
                    communications and provides insights, recommendations, and
                    draft responses to help businesses improve their customer
                    support.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    User Responsibilities
                  </h3>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account. You agree to use our services only for
                    lawful purposes and in accordance with these terms. You are also responsible for protecting your user's Personally Identifiable Information in all forms of communication. 
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Payment and Billing
                  </h3>
                  <p>
                    Subscription fees are billed monthly in advance. All fees
                    are non-refundable unless otherwise specified. We reserve
                    the right to change our pricing with 30 days notice to
                    existing customers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Service Limitations
                  </h3>
                  <p>
                    While we strive to provide accurate AI-generated insights
                    and recommendations, our service is provided "as is" without
                    warranties. You should review all AI-generated content
                    before using it in customer communications.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Termination
                  </h3>
                  <p>
                    Either party may terminate this agreement at any time. Upon
                    termination, your access to the service will cease, and we
                    will delete your data according to our data retention
                    policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Limitation of Liability
                  </h3>
                  <p>
                    In no event shall Resolvix be liable for any indirect,
                    incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use,
                    goodwill, or other intangible losses.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Navigation */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 px-6 py-2"
                >
                  Contact Support
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

          

          <Footer/>
          
    </div>
  );
}
