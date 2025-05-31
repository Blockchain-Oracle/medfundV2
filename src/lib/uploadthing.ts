import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/api/uploadthing/core";

// Create helpers for React components
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>(); 