import { useState, useEffect } from 'react';

interface WindowWithEthereum extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string }) => Promise<string[]>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  };
}

interface UseWalletConnectReturn {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  error: string | null;
  isMetaMaskInstalled: boolean;
}

export const useWalletConnect = (): UseWalletConnectReturn => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkMetaMask = () => {
      const windowWithEthereum = window as WindowWithEthereum;
      const ethereum = windowWithEthereum.ethereum;
      
      if (ethereum && ethereum.isMetaMask) {
        setIsMetaMaskInstalled(true);
        
        // Check if we're already connected
        ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
              setIsConnected(true);
            }
          })
          .catch((err: Error) => {
            console.error('Error checking connected accounts:', err);
          });
      }
    };
    
    checkMetaMask();
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress('');
      setIsConnected(false);
    } else {
      // User changed account
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  useEffect(() => {
    const windowWithEthereum = window as WindowWithEthereum;
    const ethereum = windowWithEthereum.ethereum;
    
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connectWallet = async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const windowWithEthereum = window as WindowWithEthereum;
      const ethereum = windowWithEthereum.ethereum;
      
      if (!ethereum) {
        setError('MetaMask not detected. Please install MetaMask extension.');
        return null;
      }
      
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      }
      
      return null;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to connect to wallet');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    error,
    isMetaMaskInstalled
  };
};