# Supabase Storage Setup

This document provides instructions for setting up Supabase storage buckets for the MedFund platform.

## Create Storage Buckets

The application requires two storage buckets:

1. **campaign-images**: For storing campaign preview images
2. **campaign-documents**: For storing medical documents

Follow these steps to create the required buckets:

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to "Storage" in the left sidebar
4. Click "Create a new bucket"
5. Create each of the following buckets:
   - Name: `campaign-images`
     - Make it public (enable "Public bucket" option)
   - Name: `campaign-documents`
     - Make it public (enable "Public bucket" option)

## Configure CORS

To allow file uploads from your application domain:

1. Go to the "Storage" section in your Supabase dashboard
2. Click on "Policies" in the top navigation
3. Click on "CORS Configuration"
4. Add the following configuration:

```json
[
  {
    "origin": "*",
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "headers": ["Content-Type", "Authorization", "x-client-info"],
    "maxAgeSeconds": 3600
  }
]
```

> **Note**: For production, replace the wildcard `*` origin with your actual domain.

## Set up Security Policies

For each bucket, you need to set up Row Level Security (RLS) policies:

### For campaign-images:

1. Go to the "Storage" section
2. Click on your "campaign-images" bucket
3. Go to the "Policies" tab
4. Create the following policies:

#### Read access for all users:
- Policy name: `Public Read Access`
- For operation: `SELECT`
- Policy definition: `true`

#### Insert access for authenticated users:
- Policy name: `Auth Insert Access`
- For operation: `INSERT`
- Policy definition: `auth.role() = 'authenticated'`

### For campaign-documents:

Follow the same steps as above but for the "campaign-documents" bucket.

## Testing the Setup

Once you've completed the setup, you can test it by:

1. Running the application locally
2. Creating a new campaign with an image upload
3. Checking the Supabase storage section to confirm the file was uploaded

If you encounter any issues, check the browser console for error messages related to storage permissions. 