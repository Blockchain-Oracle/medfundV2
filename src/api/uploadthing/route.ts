import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";

// Export handler that processes upload requests
export async function handler(req: Request) {
  try {
    const routeHandler = createRouteHandler({
      router: uploadRouter,
    });
    
    return await routeHandler(req);
  } catch (error) {
    console.error("Error in UploadThing route:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
} 