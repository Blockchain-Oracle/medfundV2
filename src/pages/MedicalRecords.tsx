
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Filter, Plus, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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
