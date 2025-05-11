import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MetaMaskConnectProps {
  onConnect?: (address: string) => void;
  className?: string;
  showError?: boolean;
}

const MetaMaskConnect = ({ 
  onConnect, 
  className = "", 
  showError = true 
}: MetaMaskConnectProps) => {
  const { 
    connectWallet, 
    isConnected, 
    isConnecting, 
    error, 
    isMetaMaskInstalled,
    address 
  } = useWalletConnect();

  const handleConnect = async () => {
    const walletAddress = await connectWallet();
    if (walletAddress && onConnect) {
      onConnect(walletAddress);
    }
  };

  return (
    <div className={className}>
      {showError && error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showError && !isMetaMaskInstalled && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription>
            MetaMask not detected. Please install the MetaMask extension.
          </AlertDescription>
        </Alert>
      )}
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          type="button"
          onClick={handleConnect}
          className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-6 rounded-lg font-medium text-base shadow-lg shadow-amber-500/20 transition-all duration-300 flex items-center"
          disabled={isConnecting || isConnected}
        >
          {isConnecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
            />
          ) : (
            <Wallet size={18} className="mr-2" />
          )}
          {isConnecting 
            ? "Connecting..." 
            : isConnected 
              ? `Connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`
              : "Connect MetaMask"}
        </Button>
      </motion.div>
    </div>
  );
};

export default MetaMaskConnect;