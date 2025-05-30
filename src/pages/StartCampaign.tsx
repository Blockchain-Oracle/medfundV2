
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft, Upload, Shield, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const StartCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    urgent: false,
    documents: [],
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: ""
    }
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Campaign submitted for review! We'll contact you within 24 hours.");
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">MedFund</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/campaigns" className="text-white hover:text-blue-300 transition-colors">Campaigns</Link>
              <Link to="/start-campaign" className="text-blue-300 font-semibold">Start Campaign</Link>
              <span className="text-white hover:text-blue-300 transition-colors">Governance</span>
              <span className="text-white hover:text-blue-300 transition-colors">Rewards</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </div>
          </nav>
        </div>
      </header>

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
                <span className="text-white font-semibold">Step {currentStep} of 4</span>
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

          {/* Step Content */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Campaign Details"}
                {currentStep === 2 && "Personal Information"}
                {currentStep === 3 && "Medical Documentation"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your medical fundraising needs"}
                {currentStep === 2 && "Provide your contact information for verification"}
                {currentStep === 3 && "Upload medical documents to verify your campaign"}
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
                    <Label htmlFor="goal">Fundraising Goal (AUD)</Label>
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

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
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

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
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
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Medical Documents</h3>
                    <p className="text-gray-500 mb-4">
                      Drag and drop files here, or click to select files
                    </p>
                    <Button variant="outline">
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      Supported formats: PDF, JPG, PNG (Max 10MB each)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-900">Ready to Submit</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Your campaign will be reviewed within 24 hours. We'll contact you with next steps.
                    </p>
                  </div>
                  
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
                    </div>
                    
                    <div>
                      <span className="font-semibold">Description:</span>
                      <p className="mt-1 text-gray-600">
                        {formData.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit Campaign
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
