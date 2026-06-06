import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import useTilt from '../hooks/useTilt';

// Wrapper component to apply 3D Tilt hook to list items
const TiltCard = ({ children, className, style, onClick, onMouseEnter, onMouseLeave }) => {
  const tiltRef = useTilt({ maxTilt: 10, scale: 1.02 });
  return (
    <div 
      ref={tiltRef}
      className={className}
      style={{
        ...style,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

const MyBots = () => {
  const [botsData, setBotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBotId, setSelectedBotId] = useState(null);
  const selectedBotIdRef = useRef(null);
  const [copiedBot, setCopiedBot] = useState(false);

  useEffect(() => {
    const fetchBotsData = async () => {
      try {
        const response = await fetch('/api/discord-stats');
        const result = await response.json();
        if (result.targetBots) {
          setBotsData(result.targetBots);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch bot data from backend", error);
        setLoading(false);
      }
    };

    fetchBotsData();
    const interval = setInterval(fetchBotsData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d'
  };

  const openModal = (botId) => {
    selectedBotIdRef.current = botId;
    setSelectedBotId(botId);
  };

  const closeModal = () => {
    selectedBotIdRef.current = null;
    setSelectedBotId(null);
    setCopiedBot(false);
  };

  // Block page scrolling when modal is open
  useEffect(() => {
    if (selectedBotId) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.lenis?.start();
    };
  }, [selectedBotId]);

  const copyToClipboard = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedBot(true);
    setTimeout(() => setCopiedBot(false), 2000);
  };

  const TARGET_BOT_IDS = [
    '1425494057014136913', // Vetlo™
    '1494642306102329435'  // Vally™
  ];

  // Filter only the custom bots requested
  const filteredBots = botsData.filter(b => TARGET_BOT_IDS.includes(b.id));

  // If there are no bots in the response, we can render hardcoded placeholders for them so the section is never empty
  const displayBots = filteredBots.length > 0 ? filteredBots : [
    {
      id: '1425494057014136913',
      username: 'Vetlo™',
      displayName: 'Vetlo™',
      avatar: null,
      status: 'offline',
      activities: []
    },
    {
      id: '1494642306102329435',
      username: 'Vally™',
      displayName: 'Vally™',
      avatar: null,
      status: 'offline',
      activities: []
    }
  ];

  const selectedBot = displayBots.find(b => b.id === selectedBotId);

  if (loading && filteredBots.length === 0) return null;

  return (
    <>
      <section id="my-bots" className="container" style={{ padding: '80px 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
            My <span className="text-gradient text-glow">Bots</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {displayBots.map((bot) => {
              const statusColor = statusColors[bot.status] || statusColors.offline;
              const customStatus = bot.activities.find(a => a.type === 4);

              return (
                <TiltCard 
                  key={bot.id}
                  className="glass-panel" 
                  onClick={() => openModal(bot.id)}
                  style={{ 
                    padding: '2rem 2.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '1.5rem', 
                    background: 'linear-gradient(135deg, rgba(88,101,242,0.15), rgba(20,20,30,0.85))',
                    border: '1px solid rgba(88,101,242,0.3)',
                    cursor: 'pointer',
                    borderRadius: '24px'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(88,101,242,0.5)'; 
                    e.currentTarget.style.borderColor = 'rgba(88,101,242,0.7)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.boxShadow = 'none'; 
                    e.currentTarget.style.borderColor = 'rgba(88,101,242,0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                      <img 
                        src={bot.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                        alt={bot.username} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', border: `4px solid ${statusColor}`, objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                      />
                      <div style={{ 
                        position: 'absolute', bottom: '-2px', right: '-2px', 
                        width: '20px', height: '20px', 
                        backgroundColor: statusColor, borderRadius: '50%', 
                        border: '3px solid var(--glass-bg)', zIndex: 2
                      }}></div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.45rem', margin: 0, color: '#fff', fontWeight: 'bold' }}>
                          {bot.id === '1425494057014136913' ? 'Vetlo™' : bot.id === '1494642306102329435' ? 'Vally™' : (bot.displayName || bot.username)}
                        </h4>
                        <span style={{ background: '#5865F2', color: '#fff', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', fontWeight: 'bold', flexShrink: 0 }}>BOT</span>
                      </div>
                      {customStatus && customStatus.state ? (
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {customStatus.state}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                          Click to view options
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(bot.id === '1425494057014136913' 
                        ? 'https://canary.discord.com/oauth2/authorize?client_id=1425494057014136913' 
                        : 'https://canary.discord.com/oauth2/authorize?client_id=1494642306102329435',
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                    style={{
                      background: '#5865F2',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 22px',
                      cursor: 'pointer',
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      zIndex: 10,
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(88, 101, 242, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4752C4';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#5865F2';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(88, 101, 242, 0.4)';
                    }}
                  >
                    Invite
                  </button>
                </TiltCard>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* MODAL */}
      {selectedBot && (
        <div 
          id="bot-modal-backdrop"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '420px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, rgba(30, 15, 50, 0.98), rgba(10, 10, 15, 0.98))',
              border: '1px solid rgba(138,43,226,0.4)',
              borderRadius: '24px',
              padding: '0',
              boxShadow: '0 0 60px rgba(138,43,226,0.3)',
              position: 'relative',
              animation: 'modalPopIn 0.25s ease-out',
            }}
          >
            {/* CLOSE BUTTON */}
            <div 
              id="close-bot-modal-btn"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100000,
                color: '#fff',
                fontSize: '22px',
                fontWeight: 'bold',
                lineHeight: '1',
                userSelect: 'none',
              }}
            >
              ✕
            </div>

            {(() => {
              const statusColor = statusColors[selectedBot.status] || statusColors.offline;
              const statusLabel = selectedBot.status === 'dnd' ? 'Do Not Disturb' : selectedBot.status.charAt(0).toUpperCase() + selectedBot.status.slice(1);
              const customStatus = selectedBot.activities.find(a => a.type === 4);
              const otherActivities = selectedBot.activities.filter(a => a.type !== 4);

              return (
                <>
                  {/* Banner */}
                  <div style={{ 
                    width: '100%', height: '90px', 
                    borderRadius: '24px 24px 0 0',
                    background: `linear-gradient(135deg, ${statusColor}44, rgba(138,43,226,0.4))`,
                  }} />

                  <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', marginTop: '-55px' }}>
                      <img 
                        src={selectedBot.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                        alt={selectedBot.username} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(30, 15, 50, 1)', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', bottom: '2px', right: '2px', 
                        width: '24px', height: '24px', 
                        backgroundColor: statusColor, borderRadius: '50%', 
                        border: '4px solid rgba(30, 15, 50, 1)', zIndex: 2
                      }}></div>
                    </div>

                    {/* Name */}
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#fff' }}>
                        {selectedBot.id === '1425494057014136913' ? 'Vetlo™' : selectedBot.id === '1494642306102329435' ? 'Vally™' : (selectedBot.displayName || selectedBot.username)}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>@{selectedBot.username}</span>
                        <button
                          onClick={(e) => copyToClipboard(e, selectedBot.username)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: copiedBot ? '#43b581' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s',
                          }}
                          title="Copy Bot Username"
                        >
                          {copiedBot ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '12px', background: `${statusColor}22`, justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColor }}></div>
                        <span style={{ fontSize: '0.85rem', color: statusColor, fontWeight: 'bold' }}>{statusLabel}</span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                    {/* Bio (Custom Status) */}
                    {customStatus && customStatus.state && (
                      <div style={{ 
                        width: '100%', fontSize: '1rem', 
                        color: 'var(--text-primary)', fontStyle: 'italic', 
                        background: 'rgba(255,255,255,0.04)', 
                        padding: '14px 16px', borderRadius: '12px',
                        borderLeft: `4px solid ${statusColor}`,
                      }}>
                        "{customStatus.state}"
                      </div>
                    )}

                    {/* Rich Presence */}
                    {otherActivities.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Activities</span>
                        {otherActivities.map((activity, i) => (
                          <div key={i} style={{ padding: '14px', background: 'rgba(0,0,0,0.35)', borderRadius: '12px', borderLeft: '3px solid var(--accent-purple)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                              {activity.type === 0 ? 'Playing' : activity.type === 2 ? 'Listening to' : 'Doing'}
                            </div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.05rem' }}>{activity.name}</div>
                            {activity.details && <div style={{ marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{activity.details}</div>}
                            {activity.state && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{activity.state}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {otherActivities.length === 0 && (!customStatus || !customStatus.state) && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', fontStyle: 'italic' }}>No active status or activity right now.</p>
                    )}

                    {/* Add to Server Button */}
                    <div style={{ width: '100%', marginTop: '15px' }}>
                      <a 
                        href={selectedBot.id === '1425494057014136913' 
                          ? 'https://canary.discord.com/oauth2/authorize?client_id=1425494057014136913' 
                          : 'https://canary.discord.com/oauth2/authorize?client_id=1494642306102329435'
                        }
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ textDecoration: 'none' }}
                      >
                        <button 
                          className="btn-primary" 
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            fontSize: '1rem', 
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: '#5865F2',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(88, 101, 242, 0.4)',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#4752C4';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(88, 101, 242, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#5865F2';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(88, 101, 242, 0.4)';
                          }}
                        >
                          Add to Server
                        </button>
                      </a>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPopIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default MyBots;
