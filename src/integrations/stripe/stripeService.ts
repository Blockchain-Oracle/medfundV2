/**
 * Service for interacting with Stripe
 * This is a simplified client-side only service for demo purposes.
 * In a production environment, sensitive payment operations should be handled on the server.
 */
export const StripeService = {
  /**
   * Get the formatted price display for Stripe
   * @param amount The amount in ADA
   * @param currency The currency code (default: 'ada')
   * @returns Formatted price string
   */
  getFormattedPrice(amount: number, currency: string = 'ada'): string {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  },

  /**
   * Get the currency display symbol
   * @param currency The currency code
   * @returns The currency symbol
   */
  getCurrencySymbol(currency: string = 'ada'): string {
    switch (currency.toLowerCase()) {
      case 'ada':
        return 'A';
      case 'usd':
        return '$';
      case 'eur':
        return '€';
      case 'gbp':
        return '£';
      default:
        return '';
    }
  },

  /**
   * Validate a card number using the Luhn algorithm
   * @param cardNumber The card number to validate
   * @returns Whether the card number is valid
   */
  validateCardNumber(cardNumber: string): boolean {
    // Remove any non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }
    
    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  },
  
  /**
   * Get the card type based on the card number
   * @param cardNumber The card number to check
   * @returns The card type (visa, mastercard, amex, discover, or unknown)
   */
  getCardType(cardNumber: string): string {
    // Remove spaces and dashes
    const number = cardNumber.replace(/[\s-]/g, '');
    
    // Visa
    if (/^4/.test(number)) {
      return 'visa';
    }
    
    // Mastercard
    if (/^5[1-5]/.test(number)) {
      return 'mastercard';
    }
    
    // American Express
    if (/^3[47]/.test(number)) {
      return 'amex';
    }
    
    // Discover
    if (/^6(?:011|5)/.test(number)) {
      return 'discover';
    }
    
    return 'unknown';
  }
};

export default StripeService; 