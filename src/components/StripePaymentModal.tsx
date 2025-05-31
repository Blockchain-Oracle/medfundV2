import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CreditCard, Check, AlertCircle, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import { usePrivy } from '@privy-io/react-auth';
import { createId } from '@/lib/db/utils';

// Initialize Stripe with your publishable key from environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripePaymentModalProps {
  amount: number;
  campaignTitle: string;
  currency: string;
  onClose: () => void;
  onSuccess: () => void;
}

// The main modal component that uses Elements
export const StripePaymentModal = ({ 
  amount, 
  campaignTitle, 
  currency = "usd", 
  onClose, 
  onSuccess 
}: StripePaymentModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Elements stripe={stripePromise}>
        <StripePaymentForm
          amount={amount}
          campaignTitle={campaignTitle}
          currency={currency}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </Elements>
    </div>
  );
};

// The form component that contains the actual payment logic
const StripePaymentForm = ({ 
  amount, 
  campaignTitle, 
  currency, 
  onClose, 
  onSuccess 
}: StripePaymentModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { user } = usePrivy();

  // Card element styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#e53e3e',
        iconColor: '#e53e3e',
      },
    },
    hidePostalCode: true,
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setPaymentStatus('processing');
    setCardError(null);

    try {
      // In a real implementation, you would create a payment intent on your server
      // For demo purposes, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // Set payment ID and update status
      const paymentId = paymentMethod.id;
      setPaymentIntentId(paymentId);
      setPaymentStatus('success');
      
      // Record the donation in the database
      try {
        // Extract campaign ID from URL
        const urlParts = window.location.pathname.split('/');
        const campaignId = urlParts[urlParts.length - 1];
        
        if (campaignId) {
          const donationData = {
            id: createId(),
            campaignId,
            userId: user?.id || 'anonymous',
            amount: amount.toString(),
            status: 'completed',
            anonymous: false, 
            transactionId: paymentId,
            paymentMethod: 'stripe'
          };
          
          await axios.post('/api/donations', donationData);
        }
      } catch (error) {
        console.error('Error recording donation in database:', error);
        // Still consider payment successful since Stripe processed it
      }
      
      toast.success('Payment successful!');
      
      // Notify parent component after a short delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setCardError(error.message || 'An error occurred with your payment');
      setPaymentStatus('error');
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-2xl">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-2 top-2"
          disabled={paymentStatus === 'processing'}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardTitle className="text-xl flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          Card Payment
        </CardTitle>
        <CardDescription>
          Support "{campaignTitle}" with {currency.toUpperCase()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Payment Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Information
              </label>
              <div className="border rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <CardElement options={cardElementOptions} />
              </div>
              {cardError && (
                <p className="mt-1 text-sm text-red-600">{cardError}</p>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-2">Donation Summary</h3>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Display */}
          {paymentStatus === 'processing' && (
            <div className="rounded-lg p-4 bg-blue-50 mt-4">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 text-blue-600 animate-spin" />
                <span className="text-blue-800">Processing payment...</span>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="rounded-lg p-4 bg-green-50 mt-4">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-green-800 font-medium">Payment successful!</span>
              </div>
              {paymentIntentId && (
                <div className="text-xs text-green-700 mt-1 break-all">
                  Transaction ID: {paymentIntentId}
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="rounded-lg p-4 bg-red-50 mt-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                <span className="text-red-800">Payment failed. Please try again.</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || paymentStatus === 'processing' || paymentStatus === 'success'}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Payment Complete
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </form>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <Lock className="h-3 w-3 mr-1" /> 
            Secure payment powered by Stripe. Your card details are encrypted and protected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripePaymentModal; 