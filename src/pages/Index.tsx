
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, TrendingUp, Star, MapPin, Calendar, Target, Activity, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MedFund</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/campaigns">
                <Button variant="ghost" className="hover:bg-blue-50 text-gray-700">
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Campaigns
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" className="hover:bg-blue-50 text-gray-700">
                  <Activity className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/medical-records">
                <Button variant="ghost" className="hover:bg-blue-50 text-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Records
                </Button>
              </Link>
              <Link to="/start-campaign">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                  Start Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gradient-to-br from-blue-50 to-indigo-100 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Transparent</span>{' '}
                  <span className="block text-blue-600 xl:inline">Medical Fundraising</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Connect patients with donors through our secure, KYC-verified platform. Every donation is tracked, every story is verified, and every contribution makes a difference.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <Link to="/campaigns">
                      <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Browse Campaigns
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/start-campaign">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border-2 border-blue-600 text-blue-600 hover:bg-blue-50 md:py-4 md:text-lg md:px-10">
                        Start Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Secure, Transparent, Effective
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">KYC Verified Campaigns</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Every campaign goes through rigorous identity verification to ensure authenticity and build trust.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Community Support</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Connect with a caring community of donors who want to make a real difference in healthcare.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Transparent Tracking</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Real-time updates on campaign progress with detailed breakdowns of how funds are being used.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Multiple Payment Options</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Support campaigns with traditional payments via Stripe or cryptocurrency donations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Campaigns */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Featured Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campaign 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <CardHeader>
                <CardTitle className="text-lg">Help Sarah's Cancer Treatment</CardTitle>
                <CardDescription>Supporting a young mother's fight against breast cancer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-medium">$85,000 of $120,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>342 donors</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>15 days left</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500"></div>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Surgery for Alex</CardTitle>
                <CardDescription>Urgent heart surgery needed for 8-year-old</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-medium">$42,000 of $75,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '56%'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>198 donors</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>8 days left</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <CardHeader>
                <CardTitle className="text-lg">Diabetes Treatment Fund</CardTitle>
                <CardDescription>Long-term care for diabetes management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-medium">$15,000 of $30,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>89 donors</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>22 days left</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/campaigns">
              <Button variant="outline" className="px-8 py-2">
                View All Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-xl font-bold text-white">MedFund</span>
          </div>
          <p className="mt-4 text-center text-gray-400">
            Connecting compassion with care, one donation at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
