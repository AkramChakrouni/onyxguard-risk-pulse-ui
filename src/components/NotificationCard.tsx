
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "@/types";
import RiskBadge from "./RiskBadge";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  expanded?: boolean;
  onExpand?: () => void;
}

const NotificationCard = ({ notification, expanded = false, onExpand }: NotificationCardProps) => {
  const [isOpen, setIsOpen] = useState(expanded);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onExpand) onExpand();
  };

  const priorityColor = () => {
    const priority = notification.priority;
    if (priority >= 8) return "border-r-onyx-risk-high";
    if (priority >= 5) return "border-r-onyx-risk-medium";
    return "border-r-onyx-risk-low";
  };

  const priorityWidth = () => {
    return `${Math.min(notification.priority * 10, 100)}%`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn("overflow-hidden")}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 border-r-4",
          priorityColor(),
          "glass-panel hover:shadow-xl"
        )}
      >
        <motion.div
          whileHover={!isOpen ? { scale: 1.01 } : {}}
          whileTap={!isOpen ? { scale: 0.99 } : {}}
          className="cursor-pointer"
          onClick={handleToggle}
        >
          <div className="p-4 md:p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{notification.asset_name}</h3>
                <RiskBadge risk={notification.risk_level} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </motion.button>
            </div>
            
            <h4 className="font-medium text-base mb-2">{notification.notification_type}</h4>
            
            <div className="mt-3 pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Priority: {notification.priority}/10
                </div>
                <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: priorityWidth() }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      notification.priority >= 8 ? "bg-onyx-risk-high" : 
                      notification.priority >= 5 ? "bg-onyx-risk-medium" : "bg-onyx-risk-low"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 md:px-5 md:pb-5 border-t border-border pt-3">
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-2">Full Details:</h5>
                  <p className="text-sm">{notification.reason}</p>
                </div>
                
                {notification.source && notification.source.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Sources:</h5>
                    <ul className="space-y-1">
                      {notification.source.map((source, idx) => (
                        <li key={idx} className="text-xs">
                          <a 
                            href={source} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-onyx-accent hover:underline inline-flex items-center"
                          >
                            <ExternalLink size={12} className="mr-1" />
                            {source.replace(/(^\w+:|^)\/\//, '').substring(0, 50)}
                            {source.length > 50 ? '...' : ''}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default NotificationCard;
