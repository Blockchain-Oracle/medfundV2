import { useState } from 'react';

interface UseStripePaymentProps {
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
}

interface DonationPaymentData {
  amount: number;
  currency: string;
  description: string;
  campaignId: string;
  donorEmail: string;
  donorName?: string;
  metadata?: Record<string, string>;
}

// This custom hook handles the client-side part of Stripe payments
// It makes API calls to the server for operations requiring the secret key
export function useStripePayment({ onSuccess, onError }: UseStripePaymentProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<any | null>(null);
  
  /**
   * Initialize a donation payment by calling server API
   */
  const initializePayment = async (paymentData: DonationPaymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your server API that uses the Stripe secret key
      // For now, we're simulating the response
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      const data = await response.json();
      
      if (data.success && data.clientSecret) {
        const intentData = {
          id: data.id,
          client_secret: data.clientSecret,
          amount: paymentData.amount,
          currency: paymentData.currency,
        };
        
        setPaymentIntent(intentData);
        return intentData;
      } else {
        const errorMessage = data.error || 'Failed to create payment intent';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Confirm a payment with a payment method
   */
  const confirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your server API
      const response = await fetch('/api/payments/confirm-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId, paymentMethodId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentIntent(data.paymentIntent);
        onSuccess?.(data.paymentIntent);
        return data.paymentIntent;
      } else {
        const errorMessage = data.error || 'Failed to confirm payment';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Check the status of a payment
   */
  const checkPaymentStatus = async (paymentIntentId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/payments/status/${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentIntent(data.paymentIntent);
        return data.paymentIntent;
      } else {
        const errorMessage = data.error || 'Failed to retrieve payment status';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    paymentIntent,
    initializePayment,
    confirmPayment,
    checkPaymentStatus,
  };
} 