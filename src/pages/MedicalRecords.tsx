
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Filter, Plus, Clock, User, CreditCard, Activity, Shield, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const MedicalRecords = () => {
  const records = [
    {
      title: "Annual Physical Examination",
      doctor: "Dr. Sarah Johnson",
      type: "Visit",
      date: "May 10, 2024",
      shared: true
    },
    {
      title: "Comprehensive Blood Panel",
      doctor: "City Medical Lab",
      type: "Test",
      date: "May 12, 2024",
      shared: false
    },
    {
      title: "Lisinopril Prescription",
      doctor: "Dr. Robert Chen",
      type: "Medication",
      date: "April 15, 2024",
      shared: true
    },
    {
      title: "Dental Cleaning",
      doctor: "Dr. Maria Garcia, DDS",
      type: "Procedure",
      date: "March 22, 2024",
      shared: false
    },
    {
      title: "Cardiology Consultation",
      doctor: "Dr. James Wilson",
      type: "Visit",
      date: "February 18, 2024",
      shared: true
    },
    {
      title: "COVID-19 PCR Test",
      doctor: "Urgent Care Center",
      type: "Test",
      date: "January 5, 2024",
      shared: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Visit': return 'bg-blue-100 text-blue-800';
      case 'Test': return 'bg-green-100 text-green-800';
      case 'Medication': return 'bg-purple-100 text-purple-800';
      case 'Procedure': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MedFund</span>
              </Link>
              <nav className="hidden md:flex space-x-1">
                <Link to="/dashboard">
                  <Button variant="ghost" className="hover:bg-gray-100 text-gray-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/medical-records">
                  <Button variant="ghost" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                    <FileText className="w-4 h-4 mr-2" />
                    Medical Records
                  </Button>
                </Link>
                <Link to="/campaigns">
                  <Button variant="ghost" className="hover:bg-gray-100 text-gray-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Campaigns
                  </Button>
                </Link>
                <Button variant="ghost" className="hover:bg-gray-100 text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment
                </Button>
                <Button variant="ghost" className="hover:bg-gray-100 text-gray-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Identity
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
              </div>
              <Button variant="outline" className="text-gray-600 hover:text-gray-800 border-gray-300">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
          </div>
          <p className="text-gray-600">Securely manage and share your medical records</p>
        </div>

        {/* Records Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Your Medical Records</CardTitle>
                <CardDescription>
                  View and manage all your medical information in one place
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {records.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-blue-600">{record.title}</h3>
                          {record.shared && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Shared
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{record.doctor}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs rounded ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {record.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecords;
