
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

const Dashboard = () => {
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
                  <Button variant="ghost" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                    <Activity className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/medical-records">
                  <Button variant="ghost" className="hover:bg-gray-100 text-gray-700">
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
