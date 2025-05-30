
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export const PaymentInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <CardTitle>Payment Info</CardTitle>
        </div>
        <CardDescription>
          Manage payment methods and view history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Methods</span>
          <span className="text-sm font-medium">2</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Recent Payments</span>
          <span className="text-sm font-medium">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Insurance Claims</span>
          <span className="text-sm font-medium">1</span>
        </div>
        <Button variant="outline" className="w-full mt-4">
          View details →
        </Button>
      </CardContent>
    </Card>
  );
};
