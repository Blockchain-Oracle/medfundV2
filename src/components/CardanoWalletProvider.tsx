import { ReactNode } from 'react';
import { MeshProvider } from '@meshsdk/react';

interface CardanoWalletProviderProps {
  children: ReactNode;
}

/**
 * CardanoWalletProvider is a wrapper component that provides Cardano wallet functionality
 * to its children using the Mesh SDK. It should be used at a high level in the component tree.
 */
export const CardanoWalletProvider = ({ children }: CardanoWalletProviderProps) => {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  );
};

export default CardanoWalletProvider; 