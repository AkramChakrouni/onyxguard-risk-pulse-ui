
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Notification } from "../types";
import { getNotifications } from "../services/api";
import { useToast } from "@/components/ui/use-toast";

interface NotificationContextProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getNotifications();
      
      if (response.status === 200) {
        // Add unique IDs to notifications if they don't have them
        const notificationsWithIds = response.data.map((notification, index) => ({
          ...notification,
          id: notification.id || `notification-${index}`,
        }));
        
        setNotifications(notificationsWithIds);
      } else {
        setError(response.message || "Failed to fetch notifications");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch notifications",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        loading, 
        error, 
        refreshNotifications,
        setNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  
  return context;
};
