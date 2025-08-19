import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Settings,
  ArrowRight,
  ArrowDown,
  Mail,
  Clock,
  CheckCircle,
  Frown,
  Smile,
  CreditCard,
  Forward,
  Eye,
  MessageSquare,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Resources() {
  const flowSteps = [
    {
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      title: "Fill Quick Onboarding & Pay",
      description:
        "Complete our simple onboarding form and activate your monthly subscription to get started",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <Frown className="w-8 h-8 text-red-600" />,
      title: "Frustrated Customer Email",
      description:
        "Receive an upset email from a customer demanding refunds or expressing complaints",
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <Forward className="w-8 h-8 text-purple-600" />,
      title: "Forward to Resolvix",
      description:
        "Simply forward the customer email or ticket to your dedicated Resolvix email address",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Wait 5 Minutes",
      description:
        "Our AI analyzes the email and prepares a comprehensive response with insights and recommendations",
      color: "bg-orange-50 border-orange-200",
    },
    {
      icon: <Eye className="w-8 h-8 text-indigo-600" />,
      title: "Receive AI Analysis",
      description:
        "Get customer history, fraud analysis, complaint summary, image analysis, next actions, and a draft response",
      color: "bg-indigo-50 border-indigo-200",
    },
    {
      icon: <Smile className="w-8 h-8 text-green-600" />,
      title: "Happy Customer",
      description:
        "Use our AI-crafted response to turn frustrated customers into satisfied ones",
      color: "bg-green-50 border-green-200",
    },
  ];

  const faqs = [
    {
      question: "How do I send the emails?",
      answer:
        "Just forward it to ai.resolvix from the mail provided by you while having an active subscription.",
    },
    {
      question: "What kind of emails do I send?",
      answer:
        "Anything that has a frustrated customer demanding return or refund. Even simple complaints can be forwarded where you think the customer needs an answer to neutralize the hostility they are feeling towards your brand.",
    },
    {
      question: "What can I not send?",
      answer:
        "Anything that requires specific information from your end, like tracking or product information.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
     <Header/>

      <div className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Resources & Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how Resolvix transforms frustrated customers into happy ones
              with AI-powered support responses
            </p>
          </div>

          {/* Product Demo Flow */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How Resolvix Works
            </h2>

            <div className="relative">
              {/* Flow Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {flowSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`${step.color} rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="mr-4">{step.icon}</div>
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for flow indication */}
                    {index < flowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    )}

                    {/* Arrow down for mobile */}
                    {index < flowSteps.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-4">
                        <ArrowDown className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
                  Try Resolvix Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

      
         

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of businesses already using Resolvix to turn
              frustrated customers into loyal advocates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Link to="/signup">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
                  Start Your Trial
                </Button>
              </Link> */}
              <Link to="/pricing">
                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
                >
                  View Pricing
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
