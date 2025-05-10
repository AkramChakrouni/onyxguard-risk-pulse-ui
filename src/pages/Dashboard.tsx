
import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import HeaderNav from "@/components/HeaderNav";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationCard from "@/components/NotificationCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const { notifications, loading, refreshNotifications } = useNotifications();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const refreshHandler = async () => {
    await refreshNotifications();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              Risk Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Overview of current security status and risk assessments
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={refreshHandler}
              variant="outline"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </Button>
          </motion.div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : notifications.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {notifications.map((notification) => (
              <NotificationCard 
                key={notification.id}
                notification={notification}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-accent/10 p-6 rounded-full mb-4">
              <LayoutGrid size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No notifications yet</h3>
            <p className="text-muted-foreground max-w-md">
              Enter a wallet address on the home page to begin analysis and view security alerts.
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="mt-6"
              variant="outline"
            >
              Analyze a Wallet
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
