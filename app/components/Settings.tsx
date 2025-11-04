"use client";
import { LiaFile } from "react-icons/lia";
import { ext } from "../data/types";
import { useState } from "react";
import { convertFileWithConvertAPI } from "../actions/sendFile";

interface SettingsProps {
  uploadedFile: File | null;
  fileDataURL: string | null;
}

type ConversionStatus = "idle" | "converting" | "success" | "error";

const Settings = ({ uploadedFile, fileDataURL }: SettingsProps) => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>("idle");
  const [convertedFileURL, setConvertedFileURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Theme mapping to proper Tailwind classes
  const getThemeClasses = (theme: string, isSelected: boolean) => {
    const baseClasses = "cursor-pointer rounded-xl flex flex-col p-5 items-center border-2 transition-all duration-200";

    const themeMap: {
      [key: string]: {
        border: string;
        bg: string;
        hover: string;
        selectedBorder: string;
        selectedBg: string;
        indicator: string;
      };
    } = {
      red: {
        border: "border-red-500",
        bg: "bg-red-500",
        hover: "hover:bg-red-600 hover:border-red-300",
        selectedBorder: "border-red-300",
        selectedBg: "bg-red-600",
        indicator: "bg-red-300",
      },
      blue: {
        border: "border-blue-500",
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600 hover:border-blue-300",
        selectedBorder: "border-blue-300",
        selectedBg: "bg-blue-600",
        indicator: "bg-blue-300",
      },
      green: {
        border: "border-green-500",
        bg: "bg-green-500",
        hover: "hover:bg-green-600 hover:border-green-300",
        selectedBorder: "border-green-300",
        selectedBg: "bg-green-600",
        indicator: "bg-green-300",
      },
      yellow: {
        border: "border-yellow-500",
        bg: "bg-yellow-500",
        hover: "hover:bg-yellow-600 hover:border-yellow-300",
        selectedBorder: "border-yellow-300",
        selectedBg: "bg-yellow-600",
        indicator: "bg-yellow-300",
      },
    };

    const themeClass = themeMap[theme] || themeMap.red;

    if (isSelected) {
      return `${baseClasses} ${themeClass.selectedBorder} ${themeClass.selectedBg} ${themeClass.hover}`;
    } else {
      return `${baseClasses} ${themeClass.border} ${themeClass.bg} ${themeClass.hover}`;
    }
  };

  const handleConvert = async () => {
    if (!selectedFormat || !uploadedFile) {
      console.error("No format selected or no file available");
      return;
    }

    setConversionStatus("converting");
    setErrorMessage(null);
    setConvertedFileURL(null);

    try {
      console.log("Converting to:", selectedFormat);
      console.log("File:", uploadedFile.name);
      
      const result = await convertFileWithConvertAPI(selectedFormat, uploadedFile);
      console.log("Conversion result:", result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.downloadURL) {
        setConvertedFileURL(result.downloadURL);
        setConversionStatus("success");
      } else {
        throw new Error("No download URL received from conversion service");
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      setConversionStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Conversion failed");
    }
  };

  const getConvertButtonText = () => {
    switch (conversionStatus) {
      case "converting":
        return "Converting...";
      case "success":
        return "Conversion Complete!";
      case "error":
        return "Conversion Failed - Try Again";
      default:
        return "Convert";
    }
  };

  return (
    <div className="w-full mt-5">
      <h1 className="text-white my-10 text-3xl">Convert To</h1>
      
      {/* File Info */}
      {uploadedFile && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-white text-lg">File: {uploadedFile.name}</p>
          <p className="text-gray-300">Size: {formatFileSize(uploadedFile.size)}</p>
          
          {/* لینک دانلود فایل اصلی */}
        
          
          {/* لینک دانلود فایل تبدیل شده */}
          {convertedFileURL && conversionStatus === "success" && (
            <div className="mt-2">
              <a
                href={convertedFileURL}
                download={`converted.${selectedFormat}`}
                className="text-green-400 hover:text-green-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ✅ Download Converted File ({selectedFormat.toUpperCase()})
              </a>
            </div>
          )}

          {/* نمایش خطا */}
          {errorMessage && conversionStatus === "error" && (
            <div className="mt-2 p-2 bg-red-900 text-red-200 rounded">
              Error: {errorMessage}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-5">
        {ext.map((item) => {
          const Icons = item.icon;
          const isSelected = selectedFormat === item.type;
          const themeClasses = getThemeClasses(item.theme, isSelected);

          return (
            <div
              onClick={() => setSelectedFormat(item.type)}
              className={themeClasses}
              key={item.id}
            >
              <Icons className="text-white text-5xl transition-colors duration-200" />
              <h1
                className={`p-5 text-center text-2xl transition-colors duration-200 ${
                  isSelected ? "text-white font-semibold" : "text-white"
                }`}
              >
                {item.type}
              </h1>

              {/* Selection indicator */}
              {isSelected && (
                <div
                  className={`w-6 h-6 rounded-full ${
                    item.theme === "red"
                      ? "bg-red-300"
                      : item.theme === "blue"
                      ? "bg-blue-300"
                      : item.theme === "green"
                      ? "bg-green-300"
                      : "bg-yellow-300"
                  } flex items-center justify-center`}
                >
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Convert Button */}
      <div className="flex justify-center my-10">
        {selectedFormat && (
          <button 
            className={`
              px-5 py-2 text-3xl rounded-md text-white transition-colors
              ${conversionStatus === "converting" 
                ? "bg-gray-500 cursor-not-allowed" 
                : conversionStatus === "success" 
                ? "bg-green-600 hover:bg-green-700"
                : conversionStatus === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-sky-950 hover:bg-sky-900"
              }
            `}
            onClick={handleConvert}
            disabled={conversionStatus === "converting"}
          >
            {getConvertButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;