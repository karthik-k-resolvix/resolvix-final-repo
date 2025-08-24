// src/components/DownloadTemplate.jsx
import { FileDown } from "lucide-react";

export default function DownloadTemplate({filepath}) {
  const path = "/templates/"+filepath+".pdf";
  const fileName = filepath+".pdf";
  return (

    <a
      href={path}  // Place the file in `public/templates/`
      download={fileName}
      className="inline-flex items-center px-3 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <FileDown className="w-4 h-4 mr-2" />
      Download Sample Template
    </a>
  );
}
