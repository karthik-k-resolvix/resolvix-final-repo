import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Footer from '../components/Footer';
import Header from "@/components/Header";
import { supabase } from '../supabaseClient';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function Index() {
  const [calendlyReady, setCalendlyReady] = useState(false);
   const navigate = useNavigate();
const handleStartToday = () => {
  navigate('/signUp');
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setCalendlyReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCalendly = () => {
    console.log('I am here5');
    window.location.href = 'https://calendly.com/karthik-k-resolvix/30min?redirect_url=http://localhost:8080/';
  };
  return (
    <div className="min-h-screen bg-white">
      <Header/>
    <div className="bg-gray-50 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center py-2 px-4 flex flex-col md:flex-row md:items-center md:justify-center gap-2 shadow-md rounded-xl md:rounded-full max-w-4xl mx-auto mt-4 animate-pulse">
  <span className="text-lg md:text-xl font-semibold">
    🚀 Launch Offer: <span className="text-yellow-300">Your 10 customer issues are on us!</span>
  </span>
  <Button onClick={handleStartToday} className="border-gray-300 text-gray-700 px-8 py-3 rounded-lg transition duration-200 text-s md:text-base">
                Signup for Free Demo Today!
                </Button>
    
</div>
      {/* Hero Section */}
      <section className="px-6 py-10 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Empowering Smarter
                <br />
                <span color="text-blue-600">Customer Support</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Harness your customer support data through powerful AI insights
                and deliver exceptional customer experiences.
              </p>
             
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleStartToday} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg">
                  Start Today
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 px-8 py-3 rounded-lg"
                  onClick={handleCalendly}
                  disabled={!calendlyReady}
                >
                  Book a Demo
                </Button>
              </div>
              
            </div>
            <div className="relative" >
              <img src = "/assets/heroimage.png" width="700" height="500" border-radius='10%'/>
            </div>
            

          </div>
        </div>
      </section>

      {/* Features Section - Stunning Blue Background */}
      <section className="relative bg-gradient-to-br from-[#10348c] via-blue-700 to-blue-900 px-6 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl transform -translate-x-32 -translate-y-32"></div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience the future of customer support with intelligent
              automation that understands, learns, and delivers exceptional
              results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Feature 1 */}
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🧠
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors">
                  Understands context, not just keywords
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Our AI doesn't just look for keywords. It understands the full
                  context of customer inquiries, emotions, and intent to provide
                  more accurate and helpful responses every time.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  ⚡
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-200 transition-colors">
                  Responds instantly with precision
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Lightning-fast response times without sacrificing quality. Our
                  AI processes and responds to customer queries in seconds,
                  maintaining accuracy and personalization.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🛡️
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-200 transition-colors">
                  Detects and flags fraud in real time
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Advanced fraud detection algorithms work behind the scenes to
                  identify suspicious activities and protect your business from
                  potential threats automatically.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🚀
                </div>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                  Go live in minutes
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Quick setup process gets you up and running fast. No lengthy
                  implementations or complex configurations required. Start
                  improving your customer support today.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Feature - Full Width */}
          <div className="group relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center text-3xl shadow-lg">
                  🤝
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors">
                  Built for collaboration
                </h3>
                <p className="text-blue-100 text-xl leading-relaxed max-w-4xl">
                  Seamlessly integrates with your existing team workflows.
                  Multiple agents can collaborate, share insights, and maintain
                  consistent customer experiences across all touchpoints. Scale
                  your support team's effectiveness without scaling headcount.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-12 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-blue-200">Uptime</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">&lt;2mins</div>
                <div className="text-sm text-blue-200">Response Time</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-commerce Section */}
      <section className="px-6 py-20 bg-gray-50">
            <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">
                Built for <b> Digital-first, Tech-enabled teams </b> who want
                <br />
                <span className="text-blue-600"> <b>Faster, Smarter Support</b></span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Perfect for online retailers who need to handle high volumes of
                customer inquiries while maintaining personal touch and driving
                customer satisfaction.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-blue-600 rounded-lg p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">24%</div>
                <div className="text-sm">
                  Improvement in Customer Satisfaction
                </div>
              </div>
              <div className="bg-purple-600 rounded-lg p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">40%</div>
                <div className="text-sm">Cost Savings</div>
              </div>
            </div>
          </div>
          </div>

        

          {/* Stats Row */}
          <section className="px py-20 bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">3x</div>
              <div className="text-gray-600">Faster Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                &lt;$1 a day
              </div>
              <div className="text-gray-600">Resolution Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                Zendesk
              </div>
              <div className="text-gray-600">Integration Available</div>
            </div>
          </div>
          </section>

          </section>

      

      {/* Testimonials */}
      {/* <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our
              Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "This is the best support tool we've used. It's fast, accurate,
                and has significantly improved our customer satisfaction
                scores."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Marketing</div>
                  <div className="text-sm text-gray-600">Company A</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "The AI really understands context. It's like having a human
                assistant that never sleeps. Our response times have improved
                dramatically."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Marketing</div>
                  <div className="text-sm text-gray-600">Company B</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "Great tool for support teams! The fraud detection feature has
                saved us countless hours and protected our business."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Marketing</div>
                  <div className="text-sm text-gray-600">Company C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to automate support and grow
            <br />
            your revenue?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionize your customer support experience. Start using
            cognitive systems to drive intelligent customer interactions and
            boost your revenue.
          </p>
          <Button onClick={handleStartToday} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg">
            Get started today
          </Button>
        </div>
      </section>
      <Footer/>

    </div>
  );
}
