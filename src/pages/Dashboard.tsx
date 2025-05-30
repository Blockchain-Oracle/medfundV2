import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, CreditCard, Activity, Clock, Shield, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { PatientIdentityCard } from "@/components/dashboard/PatientIdentityCard";
import { MedicalRecordsCard } from "@/components/dashboard/MedicalRecordsCard";
import { PaymentInfoCard } from "@/components/dashboard/PaymentInfoCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PaymentActivity } from "@/components/dashboard/PaymentActivity";
import { usePrivy } from "@privy-io/react-auth";

const Dashboard = () => {
  const { authenticated, user } = usePrivy();
  
  // If not authenticated, user shouldn't be able to access dashboard
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access the dashboard.
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email?.address || "User"}</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PatientIdentityCard />
          <MedicalRecordsCard />
          <PaymentInfoCard />
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <PaymentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
