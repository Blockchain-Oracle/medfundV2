import Stripe from 'stripe';

// Initialize Stripe with the publishable key from Vite environment variables
// Note: In Vite, environment variables must be prefixed with VITE_
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Ensure the publishable key is available
if (!stripePublishableKey) {
  console.warn('Stripe publishable key is not set. Payment functionality will not work properly.');
}

// Create and export the Stripe client instance
// Note: For client-side only usage with publishable key
export const stripe = new Stripe(stripePublishableKey, {
  apiVersion: '2025-05-28.basil', // Use the latest API version supported by the library
});

// This file can be imported like this:
// import { stripe } from "@/integrations/stripe/client"; 