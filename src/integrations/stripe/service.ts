import { stripe } from './client';
import type { Stripe } from 'stripe';

// Define the donation payment parameters
interface DonationPaymentParams {
  amount: number;
  currency: string;
  description: string;
  campaignId: string;
  donorEmail: string;
  donorName?: string;
  metadata?: Record<string, string>;
}

// Define successful payment response
interface PaymentResponse {
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

/**
 * Create a PaymentIntent for a donation
 * 
 * @param params Donation payment parameters
 * @returns Payment response with payment intent or error
 */
export async function createDonationPaymentIntent(params: DonationPaymentParams): Promise<PaymentResponse> {
  try {
    // Convert amount to cents (Stripe works with smallest currency unit)
    const amountInCents = Math.round(params.amount * 100);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: params.currency,
      description: params.description,
      receipt_email: params.donorEmail,
      metadata: {
        campaignId: params.campaignId,
        donorName: params.donorName || 'Anonymous',
        ...params.metadata,
      },
    });

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Confirm a PaymentIntent with payment method details
 * 
 * @param paymentIntentId The ID of the payment intent to confirm
 * @param paymentMethodId The ID of the payment method to use
 * @returns Payment response with updated payment intent or error
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentResponse> {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Retrieve a PaymentIntent by ID
 * 
 * @param paymentIntentId The ID of the payment intent to retrieve
 * @returns Payment response with payment intent or error
 */
export async function retrievePaymentIntent(paymentIntentId: string): Promise<PaymentResponse> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create a customer in Stripe
 * 
 * @param email Customer email address
 * @param name Customer name
 * @param metadata Additional metadata for the customer
 * @returns Created Stripe customer or null if error
 */
export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.create({
      email,
      name,
      metadata,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

/**
 * Refund a payment
 * 
 * @param paymentIntentId The ID of the payment intent to refund
 * @param amount Optional amount to refund (full amount if not specified)
 * @returns Refund object or null if error
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund | null> {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };
    
    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }
    
    return await stripe.refunds.create(refundParams);
  } catch (error) {
    console.error('Error refunding payment:', error);
    return null;
  }
} 