import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onFinished }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      if (onFinished) onFinished();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#050505',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
          }}
        >
          {/* Obito Glitch Text and Logo */}
          <div className="glitch-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/obito.jpg" 
              alt="Obito" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-purple)', boxShadow: '0 0 20px rgba(178, 0, 255, 0.5)' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <h1 className="glitch" data-text="OBITO" style={{ fontSize: '4rem' }}>OBITO</h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
