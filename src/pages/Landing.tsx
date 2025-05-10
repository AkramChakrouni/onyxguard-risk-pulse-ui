
import React from "react";
import { motion } from "framer-motion";
import WalletInputForm from "@/components/WalletInputForm";
import Logo from "@/components/Logo";

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const bulletPoints = [
    "Real-time Ethereum wallet risk assessment",
    "Comprehensive security analysis",
    "Intelligent threat detection"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div 
          className="flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-24"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 40%, rgba(16, 163, 127, 0.08) 0%, rgba(13, 17, 23, 0) 70%)",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              className="mb-6"
            >
              <Logo size="lg" className="mx-auto" />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight"
            >
              <span className="text-onyx-accent">Advanced Security</span> for <br /> Ethereum Assets
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              OnyxGuard analyzes blockchain activity to identify threats and vulnerabilities in real-time.
              Enter an Ethereum address to start your security assessment.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mb-12"
            >
              <WalletInputForm />
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {bulletPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  className="flex flex-col items-center p-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mb-3"
                  >
                    <span className="text-onyx-accent text-lg font-medium">
                      {index + 1}
                    </span>
                  </motion.div>
                  <p className="text-sm md:text-base font-medium text-center">
                    {point}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-card border-t border-border py-4 text-center text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()} OnyxGuard • Advanced Ethereum Security Analysis
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
