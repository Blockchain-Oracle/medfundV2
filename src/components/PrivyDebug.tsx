import { usePrivy } from "@privy-io/react-auth";

/**
 * This is a debug component to help visualize and understand the Privy user data structure.
 * It should be removed in production.
 */
export const PrivyDebug = () => {
  const { authenticated, user, ready } = usePrivy();

  if (!ready || !authenticated || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white border border-gray-200 shadow-lg p-4 m-4 rounded-lg max-w-lg z-50 text-xs overflow-auto max-h-[400px]">
      <h3 className="font-bold text-sm mb-2">Privy Debug Info</h3>
      <div className="space-y-2">
        <div>
          <strong>User ID:</strong> {user.id}
        </div>
        {user.email && (
          <div>
            <strong>Email:</strong> {user.email.address} 
            {/* Privy types might be incomplete, verified might be accessible differently */}
            {/* (verified: {user.email.verified ? 'Yes' : 'No'}) */}
          </div>
        )}
        {user.wallet && (
          <div>
            <strong>Wallet:</strong> {user.wallet.address.substring(0, 8)}...{user.wallet.address.substring(user.wallet.address.length - 6)}
          </div>
        )}
        {user.linkedAccounts && user.linkedAccounts.length > 0 && (
          <div>
            <strong>Linked Accounts:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(user.linkedAccounts, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <button 
        onClick={() => console.log('Full Privy User:', user)} 
        className="mt-2 text-blue-600 underline text-xs"
      >
        Log Full User Data to Console
      </button>
    </div>
  );
};

export default PrivyDebug; 