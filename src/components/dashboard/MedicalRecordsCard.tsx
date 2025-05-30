
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock } from "lucide-react";

export const MedicalRecordsCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-green-600" />
          <CardTitle>Medical History</CardTitle>
        </div>
        <CardDescription>
          View and manage your medical records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Records</span>
          <span className="text-sm font-medium">8</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shared Records</span>
          <span className="text-sm font-medium">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Updated</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">5 days ago</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          View details →
        </Button>
      </CardContent>
    </Card>
  );
};
