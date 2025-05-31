import React, { useState } from "react";
import { FileUpload } from "./file-upload";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { toast } from "sonner";

// Example form for campaign creation
export function CampaignFormExample() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    documentsUrl: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Example of how you would submit the form with the image URL
    toast.success("Form submitted with image URL: " + formData.imageUrl);
    console.log("Form data with uploaded files:", formData);
    
    // In a real app, you would call your API here
    // const response = await fetch("/api/campaigns/create", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     ...formData,
    //     // Add other required fields
    //   }),
    // });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter campaign title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter campaign description"
              required
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Campaign Image <span className="text-red-500">*</span>
            </label>
            <FileUpload
              endpoint="campaignImage"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url as string })}
              maxFiles={1}
              maxSize={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a cover image for your campaign
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Supporting Documents
            </label>
            <FileUpload
              endpoint="campaignDocuments"
              value={formData.documentsUrl}
              onChange={(urls) => setFormData({ ...formData, documentsUrl: urls as string[] })}
              maxFiles={5}
              maxSize={16}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload supporting documents (medical records, bills, etc.)
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Create Campaign</Button>
      </div>
    </form>
  );
} 