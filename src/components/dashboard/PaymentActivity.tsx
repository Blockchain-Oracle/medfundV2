
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const PaymentActivity = () => {
  const paymentData = [
    { month: 'Jan', value: 150 },
    { month: 'Feb', value: 280 },
    { month: 'Mar', value: 120 },
    { month: 'Apr', value: 300 },
    { month: 'May', value: 200 },
    { month: 'Jun', value: 180 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          <CardTitle>Payment Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Payment History</h4>
          <div className="flex items-end space-x-2 h-32">
            {paymentData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-green-500 w-full rounded-t"
                  style={{ height: `${(item.value / 300) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Payments ($)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
