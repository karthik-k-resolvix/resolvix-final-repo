import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileText, Check } from "lucide-react";

export default function EmailOnboardingStep2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceGuide: null as File | null,
    faqs: null as File | null,
    productCatalog: null as File | null,
    specialInstructions: "",
  });

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleFinish = async() => {
    // Get step 1 data from sessionStorage
    const raw = sessionStorage.getItem("emailOnboardingStep1");
const step1Data = raw ? JSON.parse(raw) : {};

console.log(raw);
    console.log(step1Data);

    // Combine both steps data
    const completeData = {
      ...step1Data,
      ...formData,
      specialInstructions: formData.specialInstructions,
    };

    console.log("Email onboarding completed:", completeData);

    // Clear session storage
    sessionStorage.removeItem("emailOnboardingStep1");

    // Navigate back to email management with success message
     try {
      // Insert minimal profile data into Supabase

      const fd = new FormData();

      // Add metadata fields except file objects
      const metadata = {
        brandName: step1Data.brandName,
        email: step1Data.supportEmail,
        website: step1Data.website,
        industry: step1Data.industry,
        notes: formData.serviceGuide,
        name: step1Data.name,
        brand_contact_email: sessionStorage.getItem("brand_contact_email")
      };

      fd.append('metadata', JSON.stringify([metadata]));
      console.log(metadata);
      // Append files to formData
      if (formData.serviceGuide instanceof File) fd.append('serviceGuide', formData.serviceGuide);
      if (formData.faqs instanceof File) fd.append('faqs', formData.faqs);
      if (formData.productCatalog instanceof File) fd.append('catalogue', formData.productCatalog);

      console.log(JSON.stringify(fd));      
      // Actual file upload
      const res = await fetch('https://n8n.srv756188.hstgr.cloud/webhook/ce367d9c-cb7c-47ad-acf9-a551a5083a70', {
        method: 'POST',
        body: fd
      });
      console.log(res.text());
      const respJson = await res.text();
      const redirectUrl = JSON.parse(respJson);
  if (redirectUrl && res.ok) {
    window.location.href = redirectUrl.short_url  || '/dashboard'; // 🚀 perform the redirect
  }

    } catch (err) {
      console.error(err);

      alert('Submission failed.');
    } finally {
      console.log('I am here');
    }
  };

  const DownloadGuideSection = () =>{ return (
      <a
          href="/Resolvix_Customer_Service_Guide_Template.docx"
          download
          className="text-blue font-medium px-1 py-3 rounded-lg transition-colors"
        >Find Sample Guide here
        </a>
 ) };

  const FileUploadSection = ({
    label,
    field,
    required = false,
  }: {
    label: string;
    field: keyof typeof formData;
    required?: boolean;
  }) => {
    const file = formData[field] as File | null;

    return (
      <div className="space-y-3">
        <Label className="text-black font-medium">
          {label} {required && <span className="text-red-300">*</span>}
        </Label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              handleFileUpload(field, e.target.files?.[0] || null)
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className={`bg-blue-400/50 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              file
                ? "border-green-400 bg-green-900/20"
                : "border-white/30 hover:border-white/50"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">{file.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-white/60 mx-auto" />
                <p className="text-black/80 font-medium">Upload PDF</p>
                <p className="text-black/60 text-sm">
                  Click or drag file to upload
                </p>
              </div>
            )}
          </div>
        </div>
        {field === "serviceGuide" && (
          <p className="text-gray-900 text-sm">
            Upload a service guide PDF for services, you can find out how our
            service guide template looks like.
             <DownloadGuideSection /> 
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 flex items-center justify-center px-6 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl transform -translate-x-32 -translate-y-32"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-1 bg-blue-500 rounded"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-blue-200 text-sm">Step 2 of 2</p>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tell us about your support
          </h1>
          <p className="text-blue-100 text-lg">
            This helps our AI help your customers better
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/100 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-black">
          <div className="space-y-8">
            {/* Service Guide Upload */}
            <FileUploadSection
              label="Upload the service guide for your customer support."
              field="serviceGuide"
              required
            />

            {/* FAQs Upload */}
            <FileUploadSection
              label="Upload FAQs for your site."
              field="faqs"
            />

            {/* Product Catalog Upload */}
            <FileUploadSection
              label="Upload your product catalog."
              field="productCatalog"
            />

            {/* Special Instructions */}
            <div className="space-y-3">
              <Label className="text-black font-medium">
                Any special instructions for the AI while tuning it to your
                support policies?
              </Label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialInstructions: e.target.value,
                  }))
                }
                placeholder="Write your instructions here"
                className="bg-white border-10 border-black/10 rounded-lg py-4 px-4 text-gray-900 min-h-[120px] resize-none w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Link to="/register">
              <Button
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            <Button
              onClick={handleFinish}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              <Check className="w-4 h-4 mr-2" />
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
