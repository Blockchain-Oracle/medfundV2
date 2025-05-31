# UploadThing Integration

This document outlines how file uploads are handled in this application using UploadThing.

## Overview

UploadThing is a modern, type-safe file upload service for web applications. It provides:

- Direct uploads from the browser to UploadThing's servers
- Type-safe API with TypeScript
- Customizable file validation
- Simplified file management

## Setup Instructions

1. **Create an UploadThing Account**:
   - Sign up at [https://uploadthing.com](https://uploadthing.com)
   - Create a new app in the dashboard
   - Get your API keys (App ID and Secret Key)

2. **Set Environment Variables**:
   Add these to your `.env` file:
   ```
   UPLOADTHING_SECRET=your_secret_key
   UPLOADTHING_APP_ID=your_app_id
   ```

3. **Configure File Routes**:
   The file upload routes are defined in `src/api/uploadthing/core.ts`:
   - `campaignImage`: For uploading campaign cover images
   - `campaignDocuments`: For uploading supporting documents (medical records, bills, etc.)

## Usage

### Backend

The UploadThing API is available at `/api/uploadthing`. This endpoint handles:
- File upload requests
- File validation
- Upload completion events

### Frontend

Use the `FileUpload` component to add file uploads to your forms:

```tsx
import { FileUpload } from "@/components/ui/file-upload";

// For single file uploads (like campaign images)
<FileUpload
  endpoint="campaignImage"
  value={imageUrl}
  onChange={(url) => setImageUrl(url as string)}
  maxFiles={1}
  maxSize={4} // MB
/>

// For multiple file uploads (like documents)
<FileUpload
  endpoint="campaignDocuments"
  value={documentsUrl}
  onChange={(urls) => setDocumentsUrl(urls as string[])}
  maxFiles={5}
  maxSize={16} // MB
/>
```

## Example Form

See `src/components/ui/campaign-form-example.tsx` for a complete example of using the `FileUpload` component in a form.

## Data Model

The application stores file URLs in the database, not the files themselves. The URLs point to the files stored on UploadThing's servers.

In the `campaigns` table:
- `imageUrl`: URL of the campaign cover image
- `documentsUrl`: Array of URLs for supporting documents

## File Types and Limits

- **Campaign Images**: 
  - Types: Images (jpg, png, etc.)
  - Max Size: 4MB
  - Max Count: 1

- **Campaign Documents**:
  - Types: PDFs and Images
  - Max Size: 16MB
  - Max Count: 5

## Security Considerations

- Files are validated both on the client and server
- File uploads are authenticated through the UploadThing middleware
- Large files are rejected based on configured limits
- File type validation ensures only permitted file types are uploaded 