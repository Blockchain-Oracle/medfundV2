import Stripe from 'stripe';

// This file is used in API routes (server-side)
// For Vite, server-side code is separate and can access environment variables directly
// Function to get a Stripe instance with the secret key for server-side operations
export const getServerStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY || '';
  
  if (!stripeSecretKey) {
    console.error('Stripe secret key is not set. Server-side payment operations will fail.');
    throw new Error('Stripe secret key is required');
  }
  
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-05-28.basil',
  });
};

// Example server-side implementation for payment intents
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  metadata: Record<string, string> = {}
) => {
  const stripe = getServerStripe();
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}; 