import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Code2, Volume2, VolumeX } from 'lucide-react';
import Terminal from './Terminal';
import useTilt from '../hooks/useTilt';

// Pure Web Audio API Synth Sound Generator
const playSynthSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'hover') {
      osc.type = 'sine';
      // High-pitched quick blip
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.015, ctx.currentTime); // keep it subtle
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'click') {
      osc.type = 'triangle';
      // Low-frequency sci-fi sweep
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Silently fail if audio context is blocked
  }
};

const Hero = () => {
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const logoRef = useTilt({ maxTilt: 15, scale: 1.05 });

  const roles = [
    'Bot Developer',
    'Game Developer',
    'Self Bot'
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSound = (type) => {
    if (audioEnabled) {
      playSynthSound(type);
    }
  };

  return (
    <section 
      className="container" 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'relative',
        paddingTop: '80px',
        paddingBottom: '50px',
        gap: '3rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Audio Toggle button */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            if (!audioEnabled) {
              playSynthSound('click');
            }
          }}
          style={{
            background: 'rgba(20, 20, 30, 0.6)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: audioEnabled ? 'var(--accent-neon)' : 'var(--text-secondary)',
            boxShadow: audioEnabled ? '0 0 10px rgba(178, 0, 255, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}
          title={audioEnabled ? "Disable UI Audio" : "Enable UI Audio"}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.6 }}
        style={{ 
          flex: '1 1 500px', 
          zIndex: 10, 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
          style={{ color: 'var(--accent-purple)', fontSize: '1.4rem', marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          Welcome to my portfolio
        </motion.h2>
        
        <h1 style={{ fontSize: '6rem', lineHeight: '1.1', marginBottom: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="text-gradient text-glow" style={{ color: '#b200ff' }}>OBITO</span>
        </h1>
        
        {/* Animated Roles Cycling Box */}
        <div style={{
          background: 'rgba(20, 20, 30, 0.4)',
          border: '1px solid rgba(138, 43, 226, 0.25)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          minHeight: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 25px rgba(138, 43, 226, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Neon left accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'linear-gradient(to bottom, var(--accent-purple), var(--accent-neon))'
          }} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoleIndex}
              initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'var(--text-primary)',
                textShadow: '0 0 10px rgba(178, 0, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span className="text-gradient text-glow">
                {roles[currentRoleIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
          Specializing in advanced automations, custom Discord bots, and robust backend architectures. Building the future, one line of code at a time.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 20, marginBottom: '2rem' }}>
          <button 
            onClick={() => {
              handleSound('click');
              window.lenis?.scrollTo('#projects', { duration: 3.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            }}
            onMouseEnter={() => handleSound('hover')}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <TerminalIcon size={20} />
            View Projects
          </button>
          <button 
            onClick={() => {
              handleSound('click');
              window.lenis?.scrollTo('#contact', { duration: 4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            }}
            onMouseEnter={() => handleSound('hover')}
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid var(--accent-purple)', color: 'var(--text-primary)', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Code2 size={20} />
            Contact Me
          </button>
        </div>
      </motion.div>

      {/* Right Side: Logo & Terminal Stack */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 2.8 }}
        style={{ 
          zIndex: 10, 
          flex: '1 1 400px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '480px',
          width: '100%'
        }}
      >
        <img 
          ref={logoRef}
          src="/obito.jpg" 
          alt="Obito Logo" 
          style={{ 
            width: '100%', 
            maxWidth: '220px', 
            borderRadius: '24px', 
            boxShadow: '0 0 40px rgba(178, 0, 255, 0.4)', 
            border: '2px solid rgba(138, 43, 226, 0.3)',
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'box-shadow 0.3s ease'
          }} 
          onMouseEnter={() => handleSound('hover')}
          onClick={() => handleSound('click')}
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* Embedded Terminal console */}
        <div style={{ width: '100%' }}>
          <Terminal />
        </div>
      </motion.div>

      {/* Decorative Glow Elements */}
      <div style={{ 
        position: 'absolute', 
        right: '10%', 
        top: '20%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(178,0,255,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        zIndex: 1,
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
    </section>
  );
};

export default Hero;
