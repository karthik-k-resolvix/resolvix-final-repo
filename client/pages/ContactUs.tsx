import Header from "@/components/Header";
import { Lock } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto mt-12 px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>

            <div className="text-gray-600 text-base leading-relaxed">
              <p className="mb-4">
                If you have any questions about our Privacy Policy or Terms of
                Service, feel free to reach out to us:
              </p>

              <h4 className="text-gray-800 font-semibold mb-2">Email:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>support@resolvix.tech</li>
                {/* <li>karthik.k@resolvix.tech</li> */}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
