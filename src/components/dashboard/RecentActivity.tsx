
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const RecentActivity = () => {
  const activityData = [
    { month: 'Jan', value: 3 },
    { month: 'Feb', value: 2 },
    { month: 'Mar', value: 5 },
    { month: 'Apr', value: 1 },
    { month: 'May', value: 4 },
    { month: 'Jun', value: 3 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Medical Records Activity</h4>
          <div className="flex items-end space-x-2 h-32">
            {activityData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${(item.value / 5) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Records Accessed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
