import React, { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { UploadCloud, X, FileText, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  endpoint: "campaignImage" | "campaignDocuments";
  value: string | string[];
  onChange: (value: string | string[]) => void;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
};

type UploadingFile = {
  file: File;
  progress: number;
  url?: string;
  error?: string;
};

export function FileUpload({
  endpoint,
  value,
  onChange,
  maxFiles = 1,
  maxSize = 4,
  className,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { startUpload, isUploading, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const urls = res.map((r) => r.url);
      
      // Update the value based on whether we expect a single file or multiple files
      if (maxFiles === 1) {
        onChange(urls[0]);
      } else {
        // If we already have values, append the new ones
        if (Array.isArray(value)) {
          onChange([...value, ...urls]);
        } else {
          onChange(urls);
        }
      }
      
      // Clear uploading state
      setUploadingFiles([]);
      toast.success("Upload complete!");
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadingFiles([]);
    },
    onUploadProgress: (progress) => {
      setUploadingFiles((files) =>
        files.map((f) => ({
          ...f,
          progress,
        }))
      );
    },
  });
  
  // Get permitted file types
  const fileTypes = routeConfig ? Object.keys(routeConfig) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: (acceptedFiles) => {
      setIsDragging(false);
      
      // Validate number of files
      if (maxFiles && acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
        return;
      }
      
      // Validate file size
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize * 1024 * 1024
      );
      
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed the ${maxSize}MB limit`);
        return;
      }
      
      // Start tracking upload progress
      setUploadingFiles(
        acceptedFiles.map((file) => ({
          file,
          progress: 0,
        }))
      );
      
      // Start the upload
      startUpload(acceptedFiles);
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
  });

  // Handle file removal
  const handleRemove = (fileUrl: string) => {
    if (Array.isArray(value)) {
      onChange(value.filter((url) => url !== fileUrl));
    } else {
      onChange("");
    }
  };
  
  // Function to get file name from URL
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || "file";
    } catch (e) {
      return "file";
    }
  };

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium text-lg">Drag & drop files here</h3>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse
          </p>
          {fileTypes.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Accepts: {fileTypes.join(", ")}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, up to {maxSize}MB each
          </p>
        </div>
      </div>

      {/* Uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-muted rounded-full h-2 mr-2 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded files */}
      {((Array.isArray(value) && value.length > 0) || 
        (!Array.isArray(value) && value)) && (
        <div className="mt-4 space-y-2">
          {Array.isArray(value) ? (
            value.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {getFileNameFromUrl(url)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {getFileNameFromUrl(value)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <button
                  type="button"
                  onClick={() => handleRemove(value)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 