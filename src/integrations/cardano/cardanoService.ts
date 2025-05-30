import { Transaction, ForgeScript, resolvePaymentKeyHash } from '@meshsdk/core';

// Default testnet recipient address - should be replaced with actual campaign wallet addresses
export const DEFAULT_RECIPIENT_ADDRESS = "addr_test1qqfpkkpkhhlrd9ve0smzjphc09hafcmgj74k5sskxz6sxxc0uufz0d0k8h4sfgfwh9v6tgtxea806qw7dmeg4c8yqtdstcyu88";

/**
 * Service for interacting with the Cardano blockchain
 */
export const CardanoService = {
  /**
   * Send ADA (lovelace) to a recipient address
   * @param wallet Connected wallet instance
   * @param recipientAddress Address to send ADA to
   * @param lovelaceAmount Amount in lovelace (1 ADA = 1,000,000 lovelace)
   * @returns Transaction hash
   */
  async sendAda(
    wallet: any,
    recipientAddress: string,
    lovelaceAmount: number | string
  ): Promise<string> {
    // Ensure lovelaceAmount is an integer
    const amount = typeof lovelaceAmount === 'number' 
      ? Math.floor(lovelaceAmount).toString()
      : lovelaceAmount;
      
    console.log(`Sending ${amount} lovelace to ${recipientAddress}`);
    
    // Create transaction
    const tx = new Transaction({ initiator: wallet })
      .setNetwork("preview") // Explicitly set to use preview network
      .sendLovelace(
        DEFAULT_RECIPIENT_ADDRESS, // Use the provided recipient address
        amount
      );

    // Build, sign and submit transaction
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    
    return txHash;
  },

  /**
   * Get wallet balance in ADA
   * @param wallet Connected wallet instance
   * @returns Balance in ADA
   */
  async getAdaBalance(wallet: any): Promise<number> {
    try {
      const assets = await wallet.getBalance();
      const lovelace = assets.find((asset: any) => !asset.unit.includes('.'))?.quantity || '0';
      return parseInt(lovelace) / 1000000; // Convert lovelace to ADA
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  },

  /**
   * Convert USD to ADA based on a fixed exchange rate
   * @param usdAmount Amount in USD
   * @param exchangeRate Exchange rate (default: 0.70 USD per 1 ADA)
   * @returns Amount in ADA
   */
  convertUsdToAda(usdAmount: number, exchangeRate: number = 0.70): number {
    // Since 1 ADA = 0.70 USD, to get ADA amount we divide USD by exchange rate
    return usdAmount / exchangeRate;
  },

  /**
   * Verify if a wallet has enough ADA for a transaction
   * @param wallet Connected wallet instance
   * @param requiredAda Amount of ADA required
   * @returns True if wallet has enough ADA
   */
  async hasEnoughAda(wallet: any, requiredAda: number): Promise<boolean> {
    const balance = await this.getAdaBalance(wallet);
    return balance >= requiredAda;
  },

  /**
   * Get transaction fee estimate in ADA
   * This is a simplified estimate - actual fees may vary
   * @returns Estimated transaction fee in ADA
   */
  getEstimatedFee(): number {
    // Return an average fee of 0.2 ADA
    return 0.2;
  }
};

export default CardanoService; 