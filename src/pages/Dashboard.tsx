
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, CreditCard, Activity, Clock, Shield } from "lucide-react";
import { PatientIdentityCard } from "@/components/dashboard/PatientIdentityCard";
import { MedicalRecordsCard } from "@/components/dashboard/MedicalRecordsCard";
import { PaymentInfoCard } from "@/components/dashboard/PaymentInfoCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PaymentActivity } from "@/components/dashboard/PaymentActivity";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold">MedFund Platform</span>
            </div>
            <nav className="hidden md:flex space-x-6 ml-8">
              <a href="/dashboard" className="hover:text-blue-200">Dashboard</a>
              <a href="#" className="hover:text-blue-200">Patient Identity</a>
              <a href="#" className="hover:text-blue-200">Medical History</a>
              <a href="#" className="hover:text-blue-200">Payment</a>
              <a href="/campaigns" className="hover:text-blue-200">Campaigns</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <User className="w-5 h-5" />
            <span>John Doe</span>
            <Button variant="ghost" className="text-white hover:text-blue-200">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, John Doe</p>
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
