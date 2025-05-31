import { createUploadthing, type FileRouter } from "uploadthing/server";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set uploadthing API key in the environment
if (process.env.UPLOADTHING_SECRET) {
  process.env.UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET;
}

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  campaignImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get user ID from request or authentication
      const userId = req.headers.get("x-user-id") || "anonymous";
      
      // This code runs on your server before upload
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  campaignDocuments: f({ 
      pdf: { maxFileSize: "16MB", maxFileCount: 5 },
      image: { maxFileSize: "8MB", maxFileCount: 5 }
    })
    .middleware(async ({ req }) => {
      const userId = req.headers.get("x-user-id") || "anonymous";
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter; 