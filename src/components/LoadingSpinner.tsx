
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({ size = 40, color = "#10a37f" }: LoadingSpinnerProps) => {
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1.5
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          borderTopColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-muted-foreground"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
