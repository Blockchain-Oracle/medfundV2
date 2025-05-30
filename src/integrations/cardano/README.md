# Cardano Blockchain Integration

This folder contains the components and services needed for the Cardano blockchain integration in MedFund.

## Components

- `CardanoWalletProvider.tsx`: Provider component that adds Mesh.js wallet functionality to the application
- `CardanoPaymentModal.tsx`: Modal UI for connecting wallet and sending ADA donations

## Services

- `cardanoService.ts`: Helper functions for Cardano blockchain interactions

## How Donations Work

1. The user selects "Cryptocurrency" as the payment method in the DonationForm
2. When they click "Donate", the CardanoPaymentModal opens
3. The user connects their Cardano wallet (Nami, Eternl, Flint, etc.)
4. After connecting, the wallet balance is displayed
5. The user confirms the donation by clicking the "Donate" button
6. Their wallet will open a confirmation window to sign the transaction
7. Once confirmed, the donation is sent directly to the campaign's Cardano address

## Testing

For testing purposes, you'll need a Cardano wallet extension and testnet ADA. You can get testnet ADA from the official faucet:
- [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)

## Configuration

To configure recipient addresses for each campaign, update the campaign data to include a `cardanoAddress` field. Currently, the integration uses a default test address. 