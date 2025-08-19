import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PlaceholderProps {
  pageName: string;
}

export default function Placeholder({ pageName }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-white text-3xl">🚧</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {pageName} Page Coming Soon
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          This page is currently under development. Please continue prompting to
          help build out this section of the application.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 px-8 py-3 rounded-lg"
          >
            Contact Support
          </Button>
        </div>

        <div className="mt-12 text-left bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            👋 Need this page built?
          </h3>
          <p className="text-gray-600 text-sm">
            Simply tell me what you'd like this page to contain and I'll build
            it for you. For example: "Build the pricing page with 3 tier
            options" or "Create a contact form with fields for name, email, and
            message."
          </p>
        </div>
      </div>
    </div>
  );
}
