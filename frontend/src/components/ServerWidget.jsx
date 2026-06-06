import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, CircleDot, CircleOff, Clock, Globe } from 'lucide-react';
import useTilt from '../hooks/useTilt';

// Native Web Audio Synth Sound Generator
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
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1350, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch (e) {
    // Fail silently if context is blocked
  }
};

const ServerWidget = () => {
  const [serverStats, setServerStats] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Use 3D perspective tilt on the entire server card
  const serverCardRef = useTilt({ maxTilt: 5, scale: 1.01 });

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchServerStats = async () => {
      try {
        const response = await fetch('/api/discord-stats');
        const result = await response.json();
        if (result.server) {
          setServerStats(result);
        }
      } catch (error) {
        console.error("Failed to fetch Server stats", error);
      }
    };

    fetchServerStats();
    const interval = setInterval(fetchServerStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date, timeZone) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone || 'UTC'
      });
    } catch (e) {
      return date.toUTCString().slice(17, 25);
    }
  };

  const formatDate = (date, timeZone) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: timeZone || 'UTC'
      });
    } catch (e) {
      return date.toUTCString().slice(0, 16);
    }
  };

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return (
    <section id="server" className="container" style={{ padding: '80px 2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div 
          ref={serverCardRef}
          className="glass-panel server-card" 
          onMouseEnter={() => playSynthSound('hover')}
          style={{ 
            padding: '0', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(20,20,30,0.85), rgba(138,43,226,0.12))',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(138, 43, 226, 0.25)'
          }}
        >
          {/* Server Banner with zoom on hover effect */}
          <div style={{
            width: '100%',
            height: '200px',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '2px solid rgba(138, 43, 226, 0.25)'
          }}>
            <div 
              className="server-banner-img"
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/mellow_logo.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }} 
            />
            {/* dark overlay gradient */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(5,5,10,0.6))',
              zIndex: 1
            }} />
          </div>

          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(178,0,255,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          {/* Content Wrapper */}
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 3rem 3rem 3rem' }}>
            
            {/* Interactive Pulse Glow Logo */}
            <div style={{ position: 'relative', marginTop: '-65px', zIndex: 10 }}>
              <img 
                src="/mellow_logo.jpg" 
                alt="Mellow Cafe Logo" 
                className="pulse-border"
                style={{ 
                  width: '130px', 
                  height: '130px', 
                  borderRadius: '50%', 
                  border: '3px solid var(--accent-purple)', 
                  objectFit: 'cover',
                  background: 'var(--bg-color)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=Mellow+Cafe&background=8a2be2&color=fff&size=128';
                }}
              />
            </div>
            
            <h3 style={{ fontSize: '2.8rem', marginTop: '1.2rem', marginBottom: '0.4rem', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Mellow Cafe</h3>
            <p style={{ color: 'var(--accent-neon)', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '2px', fontSize: '0.9rem' }}>OWNER: OBITO</p>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '520px', lineHeight: '1.6' }}>
              The central hub for Mellow Cafe, custom automations, active bots, and advanced digital systems.
            </p>

            {/* REAL-TIME CLOCK COMPONENT WITH INTERACTIVE HOVER */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              width: '100%',
              marginBottom: '2.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {/* UTC Server Clock */}
              <div 
                className="clock-card"
                onMouseEnter={() => playSynthSound('hover')}
                style={{
                  flex: '1 1 220px',
                  background: 'rgba(178,0,255,0.04)',
                  border: '1px solid rgba(178,0,255,0.15)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Globe size={24} color="var(--accent-neon)" style={{ filter: 'drop-shadow(0 0 5px rgba(178,0,255,0.6))' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Server Time (UTC)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace', letterSpacing: '1.5px', marginTop: '2px' }}>
                    {formatTime(currentTime, 'UTC')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {formatDate(currentTime, 'UTC')}
                  </div>
                </div>
              </div>

              {/* User Local Clock */}
              <div 
                className="clock-card"
                onMouseEnter={() => playSynthSound('hover')}
                style={{
                  flex: '1 1 220px',
                  background: 'rgba(138,43,226,0.04)',
                  border: '1px solid rgba(138,43,226,0.15)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Clock size={24} color="var(--accent-purple)" style={{ filter: 'drop-shadow(0 0 5px rgba(138,43,226,0.6))' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Local Time</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace', letterSpacing: '1.5px', marginTop: '2px' }}>
                    {formatTime(currentTime, localTimeZone)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }} title={localTimeZone}>
                    {formatDate(currentTime, localTimeZone)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-time Server Stats */}
            {serverStats && serverStats.server && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem', 
                width: '100%', 
                marginBottom: '2.5rem',
                background: 'rgba(0,0,0,0.5)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px' }}>
                  <Users size={20} color="var(--text-secondary)" />
                  <span>Total Members: <strong style={{ color: 'white' }}>{serverStats.server.total}</strong></span>
                </div>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px' }}>
                  <Bot size={20} color="var(--accent-purple)" />
                  <span>Bots: <strong style={{ color: 'white' }}>{serverStats.server.bots}</strong></span>
                </div>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px' }}>
                  <CircleDot size={20} color="#43b581" style={{ filter: 'drop-shadow(0 0 4px rgba(67,181,129,0.4))' }} />
                  <span>Online: <strong style={{ color: 'white' }}>{serverStats.server.online}</strong></span>
                </div>
                <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '0.5rem', borderRadius: '8px' }}>
                  <CircleOff size={20} color="#747f8d" />
                  <span>Offline: <strong style={{ color: 'white' }}>{serverStats.server.offline}</strong></span>
                </div>
              </div>
            )}


            
            <a 
              href="https://discord.gg/mellowcafe" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ textDecoration: 'none' }}
              onClick={() => playSynthSound('click')}
              onMouseEnter={() => playSynthSound('hover')}
            >
              <button className="btn-primary" style={{ padding: '16px 50px', fontSize: '1.1rem', letterSpacing: '2px' }}>
                Join Server
              </button>
            </a>
          </div>
        </div>
      </motion.div>

      {/* High-speed CSS Hover Animations */}
      <style>{`
        .server-card:hover .server-banner-img {
          transform: scale(1.06);
        }
        .clock-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .clock-card:hover {
          border-color: var(--accent-neon) !important;
          background: rgba(178, 0, 255, 0.08) !important;
          box-shadow: 0 0 20px rgba(178, 0, 255, 0.2);
          transform: translateY(-3px);
        }
        .stat-item {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
            border-color: rgba(138, 43, 226, 0.8);
          }
          50% { 
            box-shadow: 0 0 30px rgba(178, 0, 255, 0.8);
            border-color: rgba(178, 0, 255, 1);
          }
        }
        .pulse-border {
          animation: pulseGlow 3s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default ServerWidget;
