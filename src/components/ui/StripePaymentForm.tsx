import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStripePayment } from '@/hooks/useStripePayment';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface StripePaymentFormProps {
  campaignId: string;
  campaignTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripePaymentForm({ 
  campaignId, 
  campaignTitle, 
  onSuccess, 
  onCancel 
}: StripePaymentFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [step, setStep] = useState<'details' | 'payment' | 'success' | 'error'>('details');
  
  const { 
    loading, 
    error, 
    paymentIntent,
    initializePayment, 
    confirmPayment 
  } = useStripePayment({
    onSuccess: () => {
      setStep('success');
      onSuccess?.();
    },
    onError: () => {
      setStep('error');
    }
  });
  
  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !email) return;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    
    const result = await initializePayment({
      amount: numericAmount,
      currency: 'usd', // Using USD as default
      description: `Donation for ${campaignTitle}`,
      campaignId,
      donorEmail: email,
      donorName: name || undefined,
    });
    
    if (result) {
      setStep('payment');
    }
  };
  
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentIntent || !paymentMethod) return;
    
    await confirmPayment(paymentIntent.id, paymentMethod);
  };
  
  const handleCancel = () => {
    onCancel?.();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Donate to Campaign</CardTitle>
        <CardDescription>Support {campaignTitle} with your donation</CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'details' && (
          <form onSubmit={handleSubmitDetails} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
        
        {step === 'payment' && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Card Information</Label>
              {/* 
                This would typically integrate with Stripe Elements or
                another secure payment input. For this example, we're
                using a simple input as a placeholder.
              */}
              <Input
                id="payment-method"
                placeholder="Card number"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                <CreditCard className="inline mr-1 h-4 w-4" />
                Enter your card details securely
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
        
        {step === 'success' && (
          <div className="text-center py-6">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-500">
              Thank you for your donation of ${amount}. Your support makes a difference!
            </p>
          </div>
        )}
        
        {step === 'error' && (
          <div className="text-center py-6">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => setStep('details')} variant="outline">Try Again</Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step === 'details' && (
          <>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitDetails} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue
            </Button>
          </>
        )}
        
        {step === 'payment' && (
          <>
            <Button type="button" variant="outline" onClick={() => setStep('details')}>
              Back
            </Button>
            <Button type="submit" onClick={handleSubmitPayment} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Complete Payment
            </Button>
          </>
        )}
        
        {step === 'success' && (
          <Button className="w-full" onClick={onSuccess}>
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 