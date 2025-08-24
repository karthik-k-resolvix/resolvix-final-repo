import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Upload, FileText, Check } from "lucide-react";
import InfoBubble from "@/components/InfoBubble";
import DownloadTemplate from "@/components/DownloadTemplate";

export default function EmailOnboarding() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
    website: "",
    supportEmail: "",
    industry: "",
    country: "US",
    serviceGuide: null as File | null,
    faqs: null as File | null,
    productCatalog: null as File | null,
    specialInstructions: "",
  });

  const brand_contact_email = sessionStorage.getItem('brand_contact_email') || {};

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    updateField(field, file);
  };

  const isStep1Valid =
    formData.brandName &&
    formData.website &&
    formData.supportEmail &&
    formData.industry &&
    formData.country;

  const handleFinish = async () => {
    try {
      const fd = new FormData();
      const metadata = {
        brandName: formData.brandName,
        website: formData.website,
        email: formData.supportEmail,
        industry: formData.industry,
        country: formData.country,
        notes: formData.specialInstructions,
        brand_contact_email: brand_contact_email
      };

      fd.append("metadata", JSON.stringify([metadata]));

      if (formData.serviceGuide) fd.append("serviceGuide", formData.serviceGuide);
      if (formData.faqs) fd.append("faqs", formData.faqs);
      if (formData.productCatalog) fd.append("catalogue", formData.productCatalog);

     console.log(metadata);
      console.log(JSON.stringify(fd));
      const res = await fetch('https://n8n.srv756188.hstgr.cloud/webhook/ce367d9c-cb7c-47ad-acf9-a551a5083a70', {
        method: 'POST',
        body: fd,
      });

      const text = await res.text();
      const redirectUrl = JSON.parse(text);
      if (res.ok && redirectUrl?.short_url) {
        window.location.href = redirectUrl.short_url;
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting.");
    }
  };

  const FileUploadSection = ({
    label,
    field,
    text,
    required = false,
  }: {
    label: string;
    field: keyof typeof formData;
    text: string;
    required?: boolean;
  }) => {
    const file = formData[field] as File | null;

    return (
      <div className="space-y-3">
        <Label className="text-black font-medium">
          {label} {required && <span className="text-red-300">*</span>}
           <InfoBubble text={text} />
        </Label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`bg-blue-400/50 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            file
              ? "border-green-400 bg-green-900/20"
              : "border-white/30 hover:border-white/50"
          }`}>
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
                <p className="text-black/60 text-sm">Click or drag file to upload</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur rounded-3xl p-8 border border-white/10 text-black">
      
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tell us about your business</h2>
             <Label className="text-black font-medium">Brand Name</Label>
            <Input placeholder="Acme Inc" value={formData.brandName} onChange={(e) => updateField("brandName", e.target.value)} />
             <Label className="text-black font-medium">Website</Label>
            <Input  placeholder="www.acme.com" value={formData.website} onChange={(e) => updateField("website", e.target.value)} />
           <Label className="text-black font-medium">Support Email</Label>
            <Input placeholder="support@acme.com" value={formData.supportEmail} onChange={(e) => updateField("supportEmail", e.target.value)} />
             <Label className="text-black font-medium">Industry</Label>
            <Input placeholder="Retail, Ecommerce..." value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} />

            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={formData.country} onValueChange={(val) => updateField("country", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FileUploadSection label="Upload the service guide for your customer support." field="serviceGuide" required text="Give instructions on what type of services your provide and the usual issues that are reported" />
            <DownloadTemplate filepath='Service Guide Template'/>
            <FileUploadSection label="Upload FAQs for your site." field="faqs" text="Please help provide the frequently raised issues/asked questions to help understand user's issues better. Please share them in the format of question and answers in pdf format."/>
            <FileUploadSection label="Upload your product catalog." field="productCatalog" text="Provide links to your products which can be accessed by Resolvix to develop an understanding of your products. Share in the format of Product name and the hyperlink in the pdf format." />

            <div className="space-y-2">
              <Label>Special instructions for Resolvix Tech?</Label>
              <InfoBubble text="Special instructions could be any further requirements on how do we want the AI to reply, any special instructions for any platform specific issues reported etc."/>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => updateField("specialInstructions", e.target.value)}
                placeholder="Write your instructions here...
                Eg: AI should be more empathetic for issues reported on LinkedIN.
                Avoid sentences like - platform is responsible for merchant's products
                Ask for proof always etc."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none"
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={handleFinish} className="bg-blue-600 text-white">
                Finish <Check className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        
      </div>
    </div>
  );
}
