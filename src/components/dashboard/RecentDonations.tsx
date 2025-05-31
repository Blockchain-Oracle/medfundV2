import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import axios from 'axios';

// Define donation type
interface Donation {
  id: string;
  campaignId: string;
  userId: string;
  amount: string;
  status: string;
  message?: string;
  anonymous: boolean;
  transactionId?: string;
  paymentMethod?: string;
  createdAt: string;
  user?: {
    fullName: string;
  };
}

export const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch all donations for the user
        // For now, we'll fetch donations for a sample campaign
        const response = await axios.get('/api/campaigns/recent-donations');
        setDonations(response.data || []);
      } catch (err) {
        console.error('Error fetching recent donations:', err);
        setError('Failed to load recent donations');
        // For demo purposes, set some dummy data
        setDonations([
          {
            id: '1',
            campaignId: '123',
            userId: 'user1',
            amount: '500',
            status: 'completed',
            anonymous: false,
            createdAt: new Date().toISOString(),
            user: { fullName: 'John Donor' }
          },
          {
            id: '2',
            campaignId: '456',
            userId: 'user2',
            amount: '250',
            status: 'completed',
            anonymous: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <CardTitle>Recent Donations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-gray-500">{error}</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No recent donations found</div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">
                    {donation.anonymous ? 'Anonymous Donor' : donation.user?.fullName || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-semibold text-green-600">
                  {donation.paymentMethod === 'cardano' ? 'A' : '$'}{parseFloat(donation.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDonations; 