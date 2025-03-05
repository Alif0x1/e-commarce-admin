import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Server, Clipboard } from "lucide-react";
import { Badge } from "./ui/badge";

const textMap: Record<string, string> = {
  public: "Public",
  admin: "Admin"
};

const variantMap: Record<string, string> = {
  public: "secondary",
  admin: "destructive"
};

interface ApiAlertProps {
  title?: string; // title is optional
  description: string; // description is required
  variant?: "public" | "Admin"; // variant is either 'public' or 'admin'
}

const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = "public" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(description)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
        setCopied(false);
      });
  };

  return (

// @ts-nocheck
// @ts-expect-error
<Alert className={`p-4 sm:p-5 rounded-lg shadow-md bg-white border ${variant === "admin" ? "border-red-500" : "border-gray-400"}`}>
  <div className="flex items-start space-x-3">
    <Server className="h-5 w-5 text-gray-700" />
    <div className="flex-1">
      <AlertTitle className="text-gray-800 font-semibold text-sm sm:text-base">
        {title && <span className="text-xs sm:text-sm text-black">{title}</span>}
        {/* @ts-expect-error */}
        <Badge variant={variantMap[variant]} className="ml-2 rounded-md text-ml text-gray-70 sm:text-sm">{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-1 sm:mt-2">
        <div className="flex items-center space-x-2">
          <p className="text-xs sm:text-sm p-1 rounded-md px-2 bg-slate-200 text-black">{description}</p>
          <button onClick={handleCopy} className="p-1 rounded-md text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Copy description">
            {copied ? (
              <span className="text-green-500 text-xs sm:text-sm">Copied!</span>
            ) : (
              <Clipboard className="h-5 w-5" />
            )}
          </button>
        </div>
      </AlertDescription>
    </div>
  </div>
</Alert>


  );
};

export default ApiAlert;
