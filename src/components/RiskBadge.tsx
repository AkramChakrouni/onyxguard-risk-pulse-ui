
import { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  risk: RiskLevel;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RiskBadge = ({ 
  risk, 
  showText = true, 
  size = "md", 
  className 
}: RiskBadgeProps) => {
  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "LOW":
        return "bg-onyx-risk-low text-onyx-risk-low border-onyx-risk-low/30";
      case "MEDIUM":
        return "bg-onyx-risk-medium text-onyx-risk-medium border-onyx-risk-medium/30";
      case "HIGH":
        return "bg-onyx-risk-high text-onyx-risk-high border-onyx-risk-high/30";
      default:
        return "bg-muted text-muted-foreground border-muted/30";
    }
  };

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 rounded",
    md: "text-sm px-2.5 py-1 rounded-md",
    lg: "text-base px-3 py-1.5 rounded-md"
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };
  
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        `inline-flex items-center font-medium`,
        sizeClasses[size],
        getRiskColor(risk),
        "bg-opacity-10 border",
        className
      )}
    >
      <motion.span
        initial={{ rotate: -20 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="flex items-center"
      >
        {risk === "HIGH" ? (
          <ShieldAlert size={iconSizes[size]} className="mr-1" />
        ) : (
          <Shield size={iconSizes[size]} className="mr-1" />
        )}
      </motion.span>
      {showText && <span>{risk}</span>}
    </motion.div>
  );
};

export default RiskBadge;
