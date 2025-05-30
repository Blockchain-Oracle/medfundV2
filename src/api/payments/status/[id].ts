import { getServerStripe } from '@/integrations/stripe/server';

// This file would be used as an API route in a framework like Express or Next.js
// For Vite, you'd need to set up a server middleware or use a framework like express
export async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Extract payment intent ID from URL
    // In a real implementation, you'd use URL params from your routing solution
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const paymentIntentId = pathParts[pathParts.length - 1];

    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: 'Payment intent ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get server-side Stripe instance
    const stripe = getServerStripe();
    
    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return new Response(JSON.stringify({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 