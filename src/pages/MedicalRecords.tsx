import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Filter, Plus, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { getUserMedicalRecords } from "@/lib/db/helpers";
import { toast } from "sonner";

const MedicalRecords = () => {
  const { authenticated, user } = usePrivy();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // Load medical records from database
  useEffect(() => {
    const fetchRecords = async () => {
      if (!authenticated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const fetchedRecords = await getUserMedicalRecords(user.id);
        setRecords(fetchedRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        toast.error('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecords();
  }, [authenticated, user]);
  
  // If not authenticated, user shouldn't be able to access medical records
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access your medical records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Filter records based on active tab
  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(record => record.recordType.toLowerCase() === activeTab);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'surgery': return 'bg-blue-100 text-blue-800';
      case 'test_result': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'treatment': return 'bg-orange-100 text-orange-800';
      case 'consultation': return 'bg-yellow-100 text-yellow-800';
      case 'diagnosis': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="consultation">Visits</TabsTrigger>
                <TabsTrigger value="test_result">Tests</TabsTrigger>
                <TabsTrigger value="prescription">Medications</TabsTrigger>
                <TabsTrigger value="surgery">Procedures</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredRecords.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-blue-600">{record.title}</h3>
                            {record.isShared && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                Shared
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{record.provider || 'Unknown Provider'}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs rounded ${getTypeColor(record.recordType)}`}>
                            {record.recordType.replace('_', ' ')}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(record.recordDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No medical records found.</p>
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Record
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecords;
