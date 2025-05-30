# Stripe Integration Plan for MedFund

## Overview

This document outlines the plan for integrating Stripe as a payment processor for the MedFund platform, enabling secure donation processing for medical fundraising campaigns.

## Components Implemented

1. **Stripe Client** (`src/integrations/stripe/client.ts`)
   - Configures and exports a Stripe client instance with the publishable key
   - Uses Vite environment variables (`import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`)

2. **Stripe Server Integration** (`src/integrations/stripe/server.ts`)
   - Provides server-side Stripe instance with secret key for API routes
   - Handles secure payment operations

3. **API Routes** (`src/api/payments/`)
   - `create-intent.ts`: Creates payment intents for donations
   - `confirm-intent.ts`: Confirms payments with payment methods
   - `status/[id].ts`: Retrieves payment status

4. **React Hook** (`src/hooks/useStripePayment.ts`)
   - Custom hook for React components to interact with Stripe
   - Makes fetch calls to API routes instead of direct Stripe SDK calls
   - Handles loading states, errors, and payment flow

5. **Payment Form Component** (`src/components/ui/StripePaymentForm.tsx`)
   - Reusable UI component for processing donations
   - Multi-step form with validation
   - Error handling and success states

## Vite-Specific Considerations

1. **Environment Variables**
   - Client-side variables must be prefixed with `VITE_` (e.g., `VITE_STRIPE_PUBLISHABLE_KEY`)
   - Server-side variables like `STRIPE_SECRET_KEY` are only accessible in API routes
   - Variables are accessed via `import.meta.env.VARIABLE_NAME`

2. **API Routes**
   - Vite doesn't have built-in API route support like Next.js
   - Implementation options:
     - Separate Express/Node.js server (recommended for production)
     - Vite plugin for simple API routes during development
     - Proxy configuration in `vite.config.ts`

3. **Development Setup**
   - Configure proxy in `vite.config.ts` to forward API requests
   - Run a separate API server for handling Stripe operations
   - Use environment variables from `.env` files

## Next Steps

1. **Stripe Elements Integration**
   - Implement Stripe Elements for secure card input
   - Requires Stripe.js front-end library
   - Load Stripe.js in index.html or via dynamic import

2. **API Server Implementation**
   - Set up Express/Node.js server for production
   - Implement the API routes as Express routes
   - Configure CORS and security headers

3. **Webhook Implementation**
   - Create webhook endpoint to handle Stripe events
   - Process asynchronous payment events (success, failure, disputes)
   - Update database records based on payment status changes

4. **Save Payment Methods**
   - Allow users to save payment methods for future donations
   - Implement customer portal for managing saved payment methods

5. **Testing**
   - Set up test environment with Stripe test keys
   - Create test suite for payment flows
   - Test webhooks with Stripe CLI

## Cardano Integration (Future)

In addition to Stripe for traditional payments, we plan to implement Cardano blockchain integration for cryptocurrency donations as outlined in `docs/cardano-integration-plan.md`.

## Security Considerations

- PCI Compliance through Stripe Elements
- Proper API key management
  - Never expose secret keys in client-side code
  - Only use publishable keys in the browser
- HTTPS for all communications
- Webhook signature verification
- Proper error handling to prevent information leakage

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Elements Guide](https://stripe.com/docs/stripe-js)
- [Webhook Integration](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html) 