import { useState } from 'react';
import { CardanoWallet } from '@meshsdk/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Wallet, ShieldCheck, Check, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useCardano from '@/hooks/useCardano';

interface CardanoPaymentModalProps {
  amount: number; // Amount in ADA
  campaignTitle: string;
  recipientAddress: string; // The campaign's wallet address
  onClose: () => void;
  onSuccess: () => void;
}

export const CardanoPaymentModal = ({ 
  amount, 
  campaignTitle, 
  recipientAddress, 
  onClose, 
  onSuccess 
}: CardanoPaymentModalProps) => {
  const { connected, balance, loading, sendAda, hasEnoughAda, estimatedFee } = useCardano();
  const [paymentStatus, setPaymentStatus] = useState<'connecting' | 'preparing' | 'confirming' | 'success' | 'error' | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Handle payment process
  const handlePayment = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setPaymentStatus('preparing');

      // Check if wallet has enough balance
      const hasEnough = await hasEnoughAda(amount + estimatedFee);
      if (!hasEnough) {
        toast.error(`Insufficient balance: ${balance} ADA`);
        setPaymentStatus('error');
        return;
      }

      setPaymentStatus('confirming');
      
      // Send the transaction
      const { txHash } = await sendAda(recipientAddress, amount);
      
      setTxHash(txHash);
      setPaymentStatus('success');
      toast.success('Donation successful!');
      
      // Notify parent component about successful payment
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
            disabled={paymentStatus === 'confirming' || paymentStatus === 'preparing'}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-xl flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-purple-600" />
            Cardano Donation
          </CardTitle>
          <CardDescription>
            Support "{campaignTitle}" with ADA
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className={`rounded-lg p-4 ${connected ? 'bg-green-50' : 'bg-blue-50'}`}>
            {connected ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Wallet Connected</span>
                  </div>
                  {balance !== null && (
                    <div className="text-sm text-green-700 mt-1">
                      Balance: {balance.toFixed(2)} ADA
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 border-green-200"
                >
                  Connected
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-2">
                  <Wallet className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Connect Your Wallet</span>
                </div>
                <p className="text-sm text-blue-600 mb-3">
                  To donate with Cardano, please connect your wallet.
                </p>
                <CardanoWallet />
              </div>
            )}
          </div>

          {/* Donation Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Donation Summary</h3>
            <div className="flex justify-between mb-1">
              <span>Amount:</span>
              <span className="font-medium">{amount.toFixed(2)} ADA</span>
            </div>
            <div className="flex justify-between mb-1 text-sm text-gray-500">
              <span>USD Equivalent:</span>
              <span>${(amount * 0.70).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between mb-1 text-sm text-gray-500">
              <span>Network Fee:</span>
              <span>~{estimatedFee} ADA</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{(amount + estimatedFee).toFixed(2)} ADA</span>
            </div>
          </div>

          {/* Status Display */}
          {paymentStatus && (
            <div className={`rounded-lg p-4 ${
              paymentStatus === 'success' ? 'bg-green-50' : 
              paymentStatus === 'error' ? 'bg-red-50' : 
              'bg-blue-50'
            }`}>
              {paymentStatus === 'preparing' && (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 text-blue-600 animate-spin" />
                  <span className="text-blue-800">Preparing transaction...</span>
                </div>
              )}
              {paymentStatus === 'confirming' && (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 text-blue-600 animate-spin" />
                  <span className="text-blue-800">Please confirm in your wallet...</span>
                </div>
              )}
              {paymentStatus === 'success' && (
                <div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-800 font-medium">Donation successful!</span>
                  </div>
                  {txHash && (
                    <div className="text-xs text-green-700 mt-1 break-all">
                      Transaction ID: {txHash}
                    </div>
                  )}
                </div>
              )}
              {paymentStatus === 'error' && (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-red-800">Transaction failed. Please try again.</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handlePayment}
            disabled={!connected || paymentStatus === 'confirming' || paymentStatus === 'preparing' || paymentStatus === 'success' || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {paymentStatus === 'preparing' || paymentStatus === 'confirming' || loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Donation Complete
              </>
            ) : (
              `Donate ${amount.toFixed(2)} ADA`
            )}
          </Button>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure blockchain transaction. Funds go directly to the campaign organizer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardanoPaymentModal; 