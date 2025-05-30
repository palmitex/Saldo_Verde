"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './loading.css';

// Helper function to safely get window dimensions
const getWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  // Default values for server-side rendering
  return {
    width: 1200,
    height: 800
  };
};

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [showCoins, setShowCoins] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    // Simula o progresso de carregamento
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 100);
        if (newProgress === 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 100);

    // Mostrar moedas após um pequeno delay
    const coinTimer = setTimeout(() => {
      setShowCoins(true);
    }, 800);

    // Update window dimensions if window resizes
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(coinTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Variante para animação das moedas
  const coinVariants = {
    initial: (i) => ({
      y: -30,
      x: i % 2 === 0 ? -120 : 120,
      opacity: 0,
      rotate: i % 2 === 0 ? -60 : 60,
      scale: 0.5,
    }),
    animate: (i) => ({
      y: 0,
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 12,
        delay: i * 0.3,
        duration: 0.8,
      },
    }),
  };

  return (
    <div className="loading-container">
      <AnimatePresence>
        {/* Partículas animadas no fundo */}
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            className="background-particle"
            initial={{
              x: Math.random() * windowDimensions.width,
              y: Math.random() * windowDimensions.height,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: [Math.random() * windowDimensions.width, Math.random() * windowDimensions.width],
              y: [Math.random() * windowDimensions.height, Math.random() * windowDimensions.height],
              opacity: [0, 0.7, 0],
              scale: [0, Math.random() * 2 + 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}

        <motion.div 
          className="loading-content"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 120,
            damping: 14,
            delay: 0.2
          }}
        >
          <motion.div 
            className="loading-logo"
            initial={{ scale: 0.8, opacity: 0, rotateY: 180, rotateZ: -10 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0, rotateZ: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 0.8 
            }}
          >
            <img src="/Porco-logo.png" alt="Saldo Verde Logo" className="logo-image" />
          </motion.div>
          
          <motion.h2 
            className="loading-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Saldo Verde
          </motion.h2>
          
          {/* Moedas animadas */}
          {showCoins && (
            <div className="coins-container">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`coin-${i}`}
                  className="coin"
                  custom={i}
                  variants={coinVariants}
                  initial="initial"
                  animate="animate"
                />
              ))}
            </div>
          )}
          
          <div className="progress-container">
            <motion.div 
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Brilho animado na barra de progresso */}
            <motion.div 
              className="progress-glow"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: 'linear',
              }}
            />
          </div>
          
          <motion.p 
            className="loading-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, type: 'spring', stiffness: 100 }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: 'loop' 
              }}
            >
              Carregando
            </motion.span>
            <motion.span
              animate={{ 
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                repeatType: 'loop',
                times: [0, 0.5, 1]
              }}
              className="loading-dots"
            >
              ...
            </motion.span>
            {" "}{Math.round(progress)}%
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}