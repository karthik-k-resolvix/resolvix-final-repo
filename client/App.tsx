import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import MyAccountPage from "./pages/MyAccountPage";
import EmailOnboardingStep1 from "./pages/EmailOnboardingStep1";
import EmailOnboardingStep2 from "./pages/EmailOnboardingStep2";
import Privacy from "./pages/Privacy";
import Resources from "./pages/Resources";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import EmailManagement from "./pages/EmailManagement";
import Settings from "./pages/Settings";
const queryClient = new QueryClient();

export default function App() {
  return (
    
   <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<MyAccountPage />} />
            <Route path="/register" element= {<EmailOnboardingStep1/>} />
            <Route path="/register-step2" element= {<EmailOnboardingStep2/>} />
            <Route
              path="/forgot-password"
              element={<Placeholder pageName="Forgot Password" />}
            />
            <Route
              path="/pricing"
              element={<Pricing />}
            />
            <Route
              path="/resources"
              element={<Resources />}
            />
             <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/dashboard/emails"
              element={<EmailManagement />}
            />
              <Route
              path="/dashboard/settings"
              element={<Settings />}
            />

            <Route path="/about" element={<Placeholder pageName="About" />} />
            <Route
              path="/contact"
              element={<ContactUs />}
            />
            <Route path="/blog" element={<Placeholder pageName="Blog" />} />
            <Route
              path="/careers"
              element={<Placeholder pageName="Careers" />}
            />
            <Route
              path="/api"
              element={<Placeholder pageName="API Documentation" />}
            />
            <Route
              path="/privacy"
              element={<Privacy />}
            />
          
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    
  );
}
