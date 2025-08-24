import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export default function InfoBubble({ text }) {
  const [open, setOpen] = useState(false);
  const bubbleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={bubbleRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-2 text-gray-500 hover:text-blue-600"
      >
        <Info className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute left-6 top-0 w-64 p-3 text-sm text-gray-700 bg-white border rounded-lg shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
}
