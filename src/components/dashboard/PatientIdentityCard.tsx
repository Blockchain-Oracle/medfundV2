
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Clock } from "lucide-react";

export const PatientIdentityCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <CardTitle>Patient Identity</CardTitle>
        </div>
        <CardDescription>
          Manage your identity and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Identity Verified</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Yes</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">MFA Enabled</span>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Yes</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Updated</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">2 days ago</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          View details →
        </Button>
      </CardContent>
    </Card>
  );
};
