import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Shield, FileText, CheckCircle, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePrivy } from "@privy-io/react-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUpload } from "@/components/ui/file-upload";

// Update the formData interface to use UploadThing URLs
interface FormData {
  title: string;
  description: string;
  storyContent: string;
  goal: string;
  category: string;
  urgent: boolean;
  walletAddress: string;
  documentsUrl: string[];
  imageUrl: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
}

const StartCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Updated total steps
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    storyContent: "",
    goal: "",
    category: "",
    urgent: false,
    walletAddress: "",
    documentsUrl: [],
    imageUrl: "",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadErrors, setFileUploadErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user, authenticated } = usePrivy();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFileUploadErrors([]);
      
      // Check if user is authenticated
      if (!authenticated || !user) {
        toast.error("You must be logged in to create a campaign");
        setIsSubmitting(false);
        return;
      }
      
      // Validate form data
      if (!formData.title || !formData.description || !formData.goal || !formData.category) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Show toast for campaign creation
      toast.info("Creating campaign...");
      
      // Check if the user exists in our database, create if not
      try {
        const userCheckResponse = await fetch('/api/users/ensure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email?.address || formData.personalInfo.email,
            name: formData.personalInfo.fullName,
          }),
        });
        
        if (!userCheckResponse.ok) {
          console.warn("Could not ensure user exists, campaign creation may fail");
        }
      } catch (error) {
        console.error("Error ensuring user exists:", error);
        // Continue anyway, the campaign creation will fail if user doesn't exist
      }
      
      // Prepare campaign data - now using UploadThing URLs directly
      const campaignData = {
        title: formData.title,
        description: formData.description,
        storyContent: formData.storyContent,
        goal: formData.goal,
        category: formData.category as "surgery" | "treatment" | "therapy" | "emergency" | "medication" | "rehabilitation" | "other",
        isUrgent: formData.urgent,
        walletAddress: formData.walletAddress,
        location: formData.personalInfo.address || null,
        userId: user.id,
        imageUrl: formData.imageUrl || null,
        documentsUrl: formData.documentsUrl || [],
      };
      
      // Call the API endpoint
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create campaign');
      }
      
      toast.success("Campaign submitted successfully!");
      
      // Navigate to the campaign detail page
      navigate(`/campaign/${result.campaign.id}`);
      
    } catch (error) {
      console.error("Error submitting campaign:", error);
      
      // Show more descriptive error based on the error message
      if (error && typeof error === 'object' && 'message' in error && error.message.includes('upload')) {
        setFileUploadErrors([error.message]);
        toast.error("Failed to upload files. Please try again with smaller files or different file formats.");
      } else {
        toast.error("Failed to submit campaign. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Start Your Medical Campaign</h1>
          <p className="text-xl text-blue-100 mb-8">
            Get the medical support you need through our verified fundraising platform
          </p>

          {/* Progress Bar */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">Step {currentStep} of {totalSteps}</span>
                <span className="text-blue-300">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              <div className="flex justify-between mt-4 text-sm">
                <span className={`${currentStep >= 1 ? 'text-blue-300' : 'text-gray-400'}`}>Campaign Details</span>
                <span className={`${currentStep >= 2 ? 'text-blue-300' : 'text-gray-400'}`}>Personal Info</span>
                <span className={`${currentStep >= 3 ? 'text-blue-300' : 'text-gray-400'}`}>Documents</span>
                <span className={`${currentStep >= 4 ? 'text-blue-300' : 'text-gray-400'}`}>Review</span>
              </div>
            </CardContent>
          </Card>

          {/* Error messages */}
          {fileUploadErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error uploading files</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {fileUploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Campaign Details"}
                {currentStep === 2 && "Campaign Story"}
                {currentStep === 3 && "Personal Information"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your medical fundraising needs"}
                {currentStep === 2 && "Share your story and journey"}
                {currentStep === 3 && "Provide your contact information for verification"}
                {currentStep === 4 && "Review your information before submitting"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Step 1: Campaign Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Emergency Heart Surgery Fund"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  
                  {/* UploadThing Image Upload */}
                  <div>
                    <Label htmlFor="imageUrl">Campaign Preview Image</Label>
                    <div className="mt-2">
                      <FileUpload
                        endpoint="campaignImage"
                        value={formData.imageUrl}
                        onChange={(url) => setFormData({...formData, imageUrl: url as string})}
                        maxFiles={1}
                        maxSize={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Square image, at least 800x800px (Max: 4MB)
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Medical Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="therapy">Therapy</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="goal">Fundraising Goal (ADA)</Label>
                    <Input
                      id="goal"
                      type="number"
                      placeholder="50000"
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="walletAddress">Cardano Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      placeholder="addr_test1..."
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is where you'll receive donations in ADA. Make sure to enter a valid Cardano address.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your medical situation, treatment needed, and how donations will be used..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-2 min-h-32"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Campaign Story */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="storyContent" className="text-lg font-semibold">Campaign Story</Label>
                    <p className="text-gray-500 text-sm mb-4">
                      Tell your campaign's full story. Be detailed and clear about the medical situation, treatment needs, and how the funds will be used.
                    </p>
                    <Textarea
                      id="storyContent"
                      placeholder="Share your complete story here. Include details about the medical condition, treatment plan, expected timeline, and how the funds will help..."
                      value={formData.storyContent}
                      onChange={(e) => setFormData({...formData, storyContent: e.target.value})}
                      className="mt-2 min-h-[300px]"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Tips for an effective campaign story
                    </h3>
                    <ul className="mt-2 text-sm text-blue-700 space-y-2">
                      <li>• Be specific about the medical condition and needed treatment</li>
                      <li>• Include a timeline of events and medical history if relevant</li>
                      <li>• Explain how the funds will be used (breakdown of costs)</li>
                      <li>• Share the impact this treatment will have on the patient's life</li>
                      <li>• Include quotes from doctors or medical professionals if available</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Smith"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => setFormData({
                          ...formData, 
                          personalInfo: {...formData.personalInfo, fullName: e.target.value}
                        })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.personalInfo.email}
                        onChange={(e) => setFormData({
                          ...formData, 
                          personalInfo: {...formData.personalInfo, email: e.target.value}
                        })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+61 4XX XXX XXX"
                        value={formData.personalInfo.phone}
                        onChange={(e) => setFormData({
                          ...formData, 
                          personalInfo: {...formData.personalInfo, phone: e.target.value}
                        })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="City, State, Country"
                        value={formData.personalInfo.address}
                        onChange={(e) => setFormData({
                          ...formData, 
                          personalInfo: {...formData.personalInfo, address: e.target.value}
                        })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">KYC Verification Required</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      All campaign creators must complete identity verification to ensure trust and safety for donors.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Document Upload & Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-amber-900">Required Documents</span>
                    </div>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Medical diagnosis or doctor's report</li>
                      <li>• Treatment plan or surgery recommendation</li>
                      <li>• Hospital or clinic estimates</li>
                      <li>• Government ID for verification</li>
                    </ul>
                  </div>
                  
                  {/* UploadThing Document Upload */}
                  <div>
                    <Label htmlFor="documentsUrl">Upload Medical Documents</Label>
                    <div className="mt-2">
                      <FileUpload
                        endpoint="campaignDocuments"
                        value={formData.documentsUrl}
                        onChange={(urls) => setFormData({...formData, documentsUrl: urls as string[]})}
                        maxFiles={5}
                        maxSize={16}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload medical documents, reports, or any supporting files (Max: 16MB each)
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6 mt-8">
                    <div className="flex items-center text-green-800 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold">All Set! Review Your Campaign</h3>
                    </div>
                    <p className="text-green-700 text-sm">
                      Please review your campaign details below before submitting.
                    </p>
                  </div>
                  
                  {/* Campaign Preview Image */}
                  {formData.imageUrl && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Campaign Image</h3>
                      <img 
                        src={formData.imageUrl}
                        alt="Campaign Preview" 
                        className="h-48 w-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Campaign Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Title:</span> {formData.title || "Not provided"}
                      </div>
                      <div>
                        <span className="font-semibold">Goal:</span> A{formData.goal || "0"}
                      </div>
                      <div>
                        <span className="font-semibold">Category:</span> {formData.category || "Not selected"}
                      </div>
                      <div>
                        <span className="font-semibold">Contact:</span> {formData.personalInfo.email || "Not provided"}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold">Wallet Address:</span> {formData.walletAddress || "Not provided"}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Description:</span>
                      <p className="mt-1 text-gray-600">
                        {formData.description || "No description provided"}
                      </p>
                    </div>
                    
                    {formData.storyContent && (
                      <div>
                        <span className="font-semibold">Story Content:</span>
                        <div className="mt-1 text-gray-600 border p-4 rounded-md max-h-48 overflow-y-auto">
                          {formData.storyContent.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.documentsUrl.length > 0 && (
                      <div>
                        <span className="font-semibold">Supporting Documents:</span>
                        <ul className="mt-1 text-gray-600 list-disc list-inside">
                          {formData.documentsUrl.map((url, index) => {
                            const fileName = url.split('/').pop() || `Document ${index + 1}`;
                            return <li key={index}>{fileName}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                        Creating Campaign...
                      </>
                    ) : "Submit Campaign"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartCampaign;
