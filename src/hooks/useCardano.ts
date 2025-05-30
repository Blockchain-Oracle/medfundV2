import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import CardanoService from '@/integrations/cardano/cardanoService';

/**
 * Custom hook for Cardano blockchain integration
 * Provides wallet status, balance and utility functions
 */
export function useCardano() {
  const { connected, wallet, connecting, name } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Update balance when wallet connection changes
  useEffect(() => {
    if (connected && wallet) {
      updateBalance();
    } else {
      setBalance(null);
    }
  }, [connected, wallet]);

  // Get current wallet balance
  const updateBalance = async () => {
    if (!wallet) return;
    
    try {
      setLoading(true);
      const adaBalance = await CardanoService.getAdaBalance(wallet);
      setBalance(adaBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send ADA to a recipient
  const sendAda = async (recipientAddress: string, amount: number) => {
    if (!wallet || !connected) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      // Convert ADA to lovelace
      const lovelaceAmount = amount * 1_000_000;
      
      // Send the transaction
      const txHash = await CardanoService.sendAda(
        wallet,
        recipientAddress,
        lovelaceAmount
      );
      
      // Update balance after transaction
      await updateBalance();
      
      return { success: true, txHash };
    } catch (error) {
      console.error('Error sending ADA:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Convert USD to ADA
  const usdToAda = (usdAmount: number) => {
    return CardanoService.convertUsdToAda(usdAmount);
  };

  // Check if wallet has enough ADA
  const hasEnoughAda = async (requiredAmount: number) => {
    if (!wallet || !connected) return false;
    return CardanoService.hasEnoughAda(wallet, requiredAmount);
  };

  return {
    connected,
    connecting,
    walletName: name,
    balance,
    loading,
    updateBalance,
    sendAda,
    usdToAda,
    hasEnoughAda,
    estimatedFee: CardanoService.getEstimatedFee(),
  };
}

export default useCardano; 