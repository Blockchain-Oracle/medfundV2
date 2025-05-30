import { getServerStripe } from '@/integrations/stripe/server';

// This file would be used as an API route in a framework like Express or Next.js
// For Vite, you'd need to set up a server middleware or use a framework like express
export async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { amount, currency = 'usd', description, campaignId, donorEmail, donorName, metadata = {} } = body;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get server-side Stripe instance
    const stripe = getServerStripe();
    
    // Convert amount to cents (Stripe works with smallest currency unit)
    const amountInCents = Math.round(amount * 100);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      description,
      receipt_email: donorEmail,
      metadata: {
        campaignId,
        donorName: donorName || 'Anonymous',
        ...metadata,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 