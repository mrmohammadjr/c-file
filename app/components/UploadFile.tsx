"use client";
import React, { useState, useRef } from "react";
import Settings from "./Settings";

type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error";

const UploadFile = () => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileDataURL, setFileDataURL] = useState<string | null>(null); // اضافه کردن state برای Data URL
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("dragging");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setStatus("uploading");

    try {
      // تبدیل فایل به Data URL
      const dataURL = await convertFileToDataURL(file);
      setFileDataURL(dataURL);
      
      // شبیه‌سازی آپلود
      await simulateFileUpload(file);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  // تابع جدید برای تبدیل فایل به Data URL
  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to convert file to Data URL"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("File reading error"));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const simulateFileUpload = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("⏳ Starting upload...");

      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Network error occurred during upload"));
        }
      }, 2000);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = () => {
    switch (status) {
      case "dragging":
        return "border-blue-500 bg-blue-50";
      case "uploading":
        return "border-yellow-500 bg-yellow-50";
      case "success":
        return "border-green-500 bg-green-50";
      case "error":
        return "border-red-500 bg-red-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "dragging":
        return "📂 Drop file to upload...";
      case "uploading":
        return "⏳ Uploading...";
      case "success":
        return "✅ Upload successful!";
      case "error":
        return "❌ Upload failed";
      default:
        return "📁 Drag & drop files here or click to browse";
    }
  };

  const resetUpload = () => {
    setStatus("idle");
    setUploadedFile(null);
    setFileDataURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 w-full mx-auto flex flex-col items-center">
      {/* Drag & Drop Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          hover:border-blue-400 hover:bg-blue-50 lg:w-1/2 max-sm:w-full
          ${getStatusColor()}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl">
            {status === "uploading" && "⏳"}
            {status === "success" && "✅"}
            {status === "error" && "❌"}
            {(status === "idle" || status === "dragging") && "📁"}
          </div>

          <p className="text-lg font-medium text-gray-700">{getStatusText()}</p>

          {uploadedFile && (
            <div className="mt-4 p-3 bg-white rounded border text-left w-full">
              <p className="font-medium truncate">{uploadedFile.name}</p>
              <p className="text-sm text-gray-600">
                {formatFileSize(uploadedFile.size)}
              </p>
              
              {/* لینک دانلود فایل اصلی */}
              {fileDataURL && status === "success" && (
                <div className="mt-2">
                  <a
                    href={fileDataURL}
                    download={uploadedFile.name}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    📥 Download Original File
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Reset Button */}
      {(status === "success" || status === "error") && (
        <>
          <button
            onClick={resetUpload}
            className="mt-4 w-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Upload Another File
          </button>
          {/* ارسال fileDataURL به کامپوننت Settings */}
          <Settings uploadedFile={uploadedFile} fileDataURL={fileDataURL} />
        </>
      )}
    </div>
  );
};

export default UploadFile;