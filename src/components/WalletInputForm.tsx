import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Wallet } from "lucide-react";
import { analyzeWallet } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { useNotifications } from "@/context/NotificationContext";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WalletInputForm = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setNotifications } = useNotifications();
  const { connectWallet, isConnected, isConnecting, error, isMetaMaskInstalled, address: connectedAddress } = useWalletConnect();

  // Update local address state when wallet connects
  React.useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setAddress(address);
      sonnerToast.success("Wallet Connected", {
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: "Error",
        description: "Please enter a wallet address or connect with MetaMask",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEthereumAddress(address)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await analyzeWallet(address);
      
      if (response.status === 200 && Array.isArray(response.data)) {
        // Add unique IDs to notifications
        const notificationsWithIds = response.data.map((notification, index) => ({
          ...notification,
          id: notification.id || `notification-${index}`,
        }));
        
        setNotifications(notificationsWithIds);
        
        // Use Sonner toast for success feedback - it's less intrusive
        sonnerToast.success("Analysis Complete", {
          description: `Successfully analyzed wallet ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Analysis Failed",
          description: response.message || "Failed to analyze wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!isMetaMaskInstalled && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription>
            MetaMask not detected. Please install the MetaMask extension or enter an address manually.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4 flex justify-center">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="shadow-lg"
        >
          <Button
            type="button"
            onClick={handleConnectWallet}
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
                ? "Connected" 
                : "Connect MetaMask"}
          </Button>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-4 my-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <motion.form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.div 
            className="relative flex-1"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Input
              type="text"
              placeholder="Enter Ethereum wallet address (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-accent/50 border-secondary h-12 pl-4 pr-10 text-onyx-text placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-onyx-accent/50 transition-all duration-300 w-full"
            />
            <div className="absolute right-3 top-3 text-muted-foreground">
              <Search size={20} />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="shadow-lg"
          >
            <Button
              type="submit"
              className="bg-onyx-accent hover:bg-onyx-accent/80 text-white h-12 px-6 rounded-lg font-medium text-base shadow-lg shadow-onyx-accent/20 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                />
              ) : null}
              {isLoading ? "Analyzing..." : "Analyze Wallet"}
            </Button>
          </motion.div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default WalletInputForm;