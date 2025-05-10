
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import HeaderNav from "@/components/HeaderNav";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Bell, RefreshCw } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification, RiskLevel } from "@/types";

const Alerts = () => {
  const { notifications, loading, refreshNotifications } = useNotifications();
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  
  const filteredNotifications = riskFilter === "ALL" 
    ? notifications 
    : notifications.filter(n => n.risk_level === riskFilter);
    
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => b.priority - a.priority
  );

  const refreshHandler = async () => {
    await refreshNotifications();
  };

  // Risk level counts
  const highCount = notifications.filter(n => n.risk_level === "HIGH").length;
  const mediumCount = notifications.filter(n => n.risk_level === "MEDIUM").length;
  const lowCount = notifications.filter(n => n.risk_level === "LOW").length;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold flex items-center"
            >
              <Bell size={20} className="mr-2 text-onyx-accent" />
              Security Alerts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Detailed analysis of potential risks and security concerns
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <Button
            variant={riskFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setRiskFilter("ALL")}
            className="bg-onyx-accent hover:bg-onyx-accent/90 text-white"
          >
            All Alerts ({notifications.length})
          </Button>
          <Button
            variant={riskFilter === "HIGH" ? "default" : "outline"}
            size="sm"
            onClick={() => setRiskFilter("HIGH")}
            className={cn(
              riskFilter === "HIGH" ? "bg-onyx-risk-high text-white hover:bg-onyx-risk-high/90" : ""
            )}
          >
            High Risk ({highCount})
          </Button>
          <Button
            variant={riskFilter === "MEDIUM" ? "default" : "outline"}
            size="sm"
            onClick={() => setRiskFilter("MEDIUM")}
            className={cn(
              riskFilter === "MEDIUM" ? "bg-onyx-risk-medium text-black hover:bg-onyx-risk-medium/90" : ""
            )}
          >
            Medium Risk ({mediumCount})
          </Button>
          <Button
            variant={riskFilter === "LOW" ? "default" : "outline"}
            size="sm"
            onClick={() => setRiskFilter("LOW")}
            className={cn(
              riskFilter === "LOW" ? "bg-onyx-risk-low text-white hover:bg-onyx-risk-low/90" : ""
            )}
          >
            Low Risk ({lowCount})
          </Button>
        </motion.div>
        
        {loading ? (
          <LoadingSpinner />
        ) : sortedNotifications.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <AnimatePresence>
              {sortedNotifications.map((notification) => (
                <AlertItem key={notification.id} notification={notification} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-accent/10 p-6 rounded-full mb-4">
              <Bell size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No alerts match your filter</h3>
            <p className="text-muted-foreground max-w-md">
              {riskFilter === "ALL" 
                ? "Enter a wallet address on the home page to begin analysis and view security alerts."
                : "Try changing your filter to see other risk levels."}
            </p>
            <Button
              onClick={() => setRiskFilter("ALL")}
              className="mt-6"
              variant="outline"
            >
              Show All Alerts
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

interface AlertItemProps {
  notification: Notification;
}

const AlertItem = ({ notification }: AlertItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const priorityColor = () => {
    const priority = notification.priority;
    if (priority >= 8) return "border-l-onyx-risk-high";
    if (priority >= 5) return "border-l-onyx-risk-medium";
    return "border-l-onyx-risk-low";
  };

  const priorityLabel = () => {
    const priority = notification.priority;
    if (priority >= 8) return "Critical Priority";
    if (priority >= 5) return "High Priority";
    return "Normal Priority";
  };

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card 
        className={cn(
          "overflow-hidden border-l-4",
          priorityColor(),
          "glass-panel"
        )}
      >
        <div
          className="p-5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {notification.asset_name}
              </h3>
              <RiskBadge risk={notification.risk_level} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {priorityLabel()} ({notification.priority}/10)
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                {expanded ? 
                  <RefreshCw size={14} className="-rotate-180" /> : 
                  <RefreshCw size={14} />
                }
              </Button>
            </div>
          </div>
          
          <h4 className="font-medium mb-2">
            {notification.notification_type}
          </h4>
          
          <p className={cn(
            "text-sm text-muted-foreground",
            !expanded && "line-clamp-2"
          )}>
            {notification.reason}
          </p>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                {notification.source && notification.source.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Sources:</h5>
                    <ul className="space-y-2">
                      {notification.source.map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-onyx-accent hover:underline inline-flex items-center text-sm bg-accent/30 px-2 py-1 rounded"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            {source.replace(/(^\w+:|^)\/\//, '')}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default Alerts;
