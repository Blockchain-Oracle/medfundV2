import { Transaction, ForgeScript, resolvePaymentKeyHash } from '@meshsdk/core';

// Default testnet recipient address - should be replaced with actual campaign wallet addresses
export const DEFAULT_RECIPIENT_ADDRESS = "addr_test1qp9yfvry9vmwjmxjlzkcxyl7xnflwhvn3gm9q5fxpw6lx6w8j37xclznqcw2j0m62h0mqmufya6jknvw5nutvs7a5c4s4m3wlh";

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
    // Create transaction
    const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        recipientAddress,
        lovelaceAmount.toString()
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
   * Convert AUD to ADA based on a fixed exchange rate
   * @param audAmount Amount in AUD
   * @param exchangeRate Exchange rate (default: 0.75 ADA per AUD)
   * @returns Amount in ADA
   */
  convertAudToAda(audAmount: number, exchangeRate: number = 0.75): number {
    return audAmount * exchangeRate;
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