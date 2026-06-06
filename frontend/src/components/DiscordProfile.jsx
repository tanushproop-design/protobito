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

// Discord Profile Decoration Badges
const CrownBadge = () => (
  <span title="Server Owner" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 2px #faa61a)' }}>
      <path d="M2 4L5 12L12 6L19 12L22 4L17 19H7L2 4Z" fill="#faa61a" stroke="#faa61a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const BoosterBadge = () => (
  <span title="Server Booster" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 2px #ff73fa)' }}>
      <path d="M12 2L2 9.5L12 22L22 9.5L12 2Z" fill="#ff73fa" />
      <path d="M12 2V22M12 2L7 9.5L12 22M12 2L17 9.5L12 22" stroke="#fff" strokeWidth="0.8" />
    </svg>
  </span>
);

const ActiveDevBadge = () => (
  <span title="Active Developer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 2px #5865F2)' }}>
      <path d="M12 2L2 7V12C2 17 6 21 12 23C18 21 22 17 22 12V7L12 2Z" fill="#5865F2" />
      <path d="M9 11L11 13L15 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const DiscordWatermark = () => (
  <div style={{
    position: 'absolute',
    right: '-10px',
    bottom: '-15px',
    opacity: 0.03,
    color: '#ffffff',
    pointerEvents: 'none',
    transform: 'rotate(-15deg)',
    zIndex: 0
  }}>
    <svg width="110" height="110" viewBox="0 0 127.14 96.36" fill="currentColor">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.66,1.8-1.34,2.66-2a75.58,75.58,0,0,0,72.46,0c.86.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.5,5,77.89,77.89,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,122.56,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
    </svg>
  </div>
);

const DiscordProfile = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUserIdRef = useRef(null);
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch('/api/discord-stats');
        const result = await response.json();
        if (result.users) {
          setUsersData(result.users);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Discord data from backend", error);
        setLoading(false);
      }
    };

    fetchDiscordData();
    const interval = setInterval(fetchDiscordData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Block page scrolling when modal is open
  useEffect(() => {
    if (selectedUserId) {
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
  }, [selectedUserId]);

  const statusColors = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d'
  };

  const openModal = (userId) => {
    selectedUserIdRef.current = userId;
    setSelectedUserId(userId);
  };

  const closeModal = () => {
    selectedUserIdRef.current = null;
    setSelectedUserId(null);
    setCopiedUser(false);
  };

  const copyToClipboard = (e, text, setCopiedState) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  if (loading) return null;

  const selectedUser = usersData.find(u => u.id === selectedUserId);

  return (
    <>
      <section className="container" style={{ padding: '50px 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            Team <span className="text-gradient text-glow">Activity</span>
          </h2>

          {usersData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#f04747' }}>Failed to connect to Discord Bot or no users found.</p>
          ) : (() => {
            const TARGET_USERNAMES = [
              '9p7t',
              'l6hx',
              'issuesolverr',
              'm5je',
              'y62k',
              'sweetdrums.dll',
              '5jql'
            ];

            const activeUsers = usersData.filter(u => TARGET_USERNAMES.includes(u.username));
            const owner = activeUsers.find(u => u.username === '9p7t');
            const team = activeUsers.filter(u => u.username !== '9p7t');
            const ownerStatusColor = owner ? (statusColors[owner.status] || statusColors.offline) : '#747f8d';
            const ownerCustomStatus = owner ? owner.activities.find(a => a.type === 4) : null;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                
                {/* OWNER - Big Card */}
                {owner && (
                  <TiltCard 
                    onClick={() => openModal(owner.id)}
                    className="glass-panel"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      background: 'rgba(20,20,30,0.85)',
                      border: '1px solid rgba(178,0,255,0.3)',
                      cursor: 'pointer',
                      maxWidth: '420px',
                      width: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                      borderRadius: '20px',
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.boxShadow = '0 0 35px rgba(178,0,255,0.45)'; 
                      e.currentTarget.style.borderColor = 'rgba(178,0,255,0.65)';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.boxShadow = 'none'; 
                      e.currentTarget.style.borderColor = 'rgba(178,0,255,0.3)';
                    }}
                  >
                    {/* Top Discord Banner */}
                    <div style={{
                      width: '100%',
                      height: '65px',
                      backgroundImage: owner.banner ? `url(${owner.banner})` : 'none',
                      backgroundColor: owner.accentColor || 'rgba(138, 43, 226, 0.4)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }} />

                    {/* Discord Watermark in Background */}
                    <DiscordWatermark />

                    {/* Content Section */}
                    <div style={{ padding: '1.25rem', position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '-45px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                          <img 
                            src={owner.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                            alt={owner.username} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              borderRadius: '50%', 
                              border: '3px solid rgba(20,20,30,1)', 
                              outline: `3px solid ${ownerStatusColor}`,
                              objectFit: 'cover',
                              background: '#050505'
                            }}
                            onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                          />
                          {owner.avatarDecoration && (
                            <img src={owner.avatarDecoration} alt="Decoration" style={{ position: 'absolute', top: '-15%', left: '-15%', width: '130%', height: '130%', pointerEvents: 'none', zIndex: 1 }} />
                          )}
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '0px', 
                            right: '0px', 
                            width: '18px', 
                            height: '18px', 
                            backgroundColor: ownerStatusColor, 
                            borderRadius: '50%', 
                            border: '3px solid rgba(20,20,30,1)', 
                            zIndex: 2 
                          }} />
                        </div>

                        {/* Copy ID Button */}
                        <button
                          onClick={(e) => copyToClipboard(e, owner.username, setCopiedOwner)}
                          style={{
                            background: copiedOwner ? 'rgba(67, 181, 129, 0.15)' : 'rgba(178, 0, 255, 0.15)',
                            border: copiedOwner ? '1px solid #43b581' : '1px solid rgba(178, 0, 255, 0.3)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            color: copiedOwner ? '#43b581' : '#fff',
                            fontSize: '0.8rem',
                            transition: 'all 0.3s ease',
                            marginTop: '22px',
                          }}
                          title="Copy Discord Username"
                        >
                          {copiedOwner ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedOwner ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Info Details */}
                      <div style={{ marginTop: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                          <h3 style={{ fontSize: '1.35rem', margin: 0, color: '#fff', fontWeight: 'bold' }}>
                            {owner.displayName || owner.username}
                          </h3>
                          
                          {/* Badges system */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(0,0,0,0.4)', padding: '2px 5px', borderRadius: '6px' }}>
                            <CrownBadge />
                            <ActiveDevBadge />
                            <BoosterBadge />
                          </div>
                        </div>

                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@{owner.username}</span>
                        
                        {ownerCustomStatus && ownerCustomStatus.state && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-primary)', 
                            marginTop: '8px', 
                            fontStyle: 'italic',
                            padding: '6px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${ownerStatusColor}`,
                            display: 'inline-block'
                          }}>
                            "{ownerCustomStatus.state}"
                          </div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                )}

                {/* TEAM MEMBERS - Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', width: '100%' }}>
                  {team.map((user) => {
                    const statusColor = statusColors[user.status] || statusColors.offline;
                    const customStatus = user.activities.find(a => a.type === 4);

                    return (
                      <TiltCard 
                        key={user.id}
                        className="glass-panel" 
                        onClick={() => openModal(user.id)}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          background: 'rgba(20,20,30,0.75)',
                          cursor: 'pointer',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.boxShadow = '0 0 25px rgba(138,43,226,0.4)'; 
                          e.currentTarget.style.borderColor = 'rgba(138,43,226,0.55)';
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.boxShadow = 'none'; 
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                        }}
                      >
                        {/* Mini Banner */}
                        <div style={{
                          width: '100%',
                          height: '42px',
                          backgroundImage: user.banner ? `url(${user.banner})` : 'none',
                          backgroundColor: user.accentColor || `${statusColor}33`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />

                        {/* Discord Watermark in Background */}
                        <DiscordWatermark />

                        {/* Card Body */}
                        <div style={{ padding: '1rem', position: 'relative', zIndex: 2 }}>
                          {/* Avatar Overlap */}
                          <div style={{ position: 'relative', width: '48px', height: '48px', marginTop: '-32px', marginBottom: '8px', flexShrink: 0 }}>
                            <img 
                              src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                              alt={user.username} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                borderRadius: '50%', 
                                border: '2.5px solid rgba(20,20,30,1)', 
                                outline: `2px solid ${statusColor}`,
                                objectFit: 'cover',
                                background: '#050505'
                              }}
                              onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                            />
                            {user.avatarDecoration && (
                              <img src={user.avatarDecoration} alt="Decoration" style={{ position: 'absolute', top: '-15%', left: '-15%', width: '130%', height: '130%', pointerEvents: 'none', zIndex: 1 }} />
                            )}
                            <div style={{ 
                              position: 'absolute', bottom: '0px', right: '0px', 
                              width: '12px', height: '12px', 
                              backgroundColor: statusColor, borderRadius: '50%', 
                              border: '2px solid rgba(20,20,30,1)', zIndex: 2
                            }} />
                          </div>

                          {/* Info */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                              <h4 style={{ fontSize: '1.05rem', margin: 0, color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.displayName || user.username}
                              </h4>
                              {/* Badges for Members */}
                              <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '1px 3px', borderRadius: '4px', flexShrink: 0 }}>
                                <ActiveDevBadge />
                              </div>
                            </div>
                            
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{user.username}</span>
                            
                            {customStatus && customStatus.state && (
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-secondary)', 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                marginTop: '6px',
                                fontStyle: 'italic'
                              }}>
                                "{customStatus.state}"
                              </div>
                            )}
                          </div>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </motion.div>
      </section>

      {/* MODAL - completely outside the section, no framer-motion */}
      {selectedUser && (
        <div 
          id="profile-modal-backdrop"
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
              id="close-modal-btn"
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
              const statusColor = statusColors[selectedUser.status] || statusColors.offline;
              const statusLabel = selectedUser.status === 'dnd' ? 'Do Not Disturb' : selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1);
              const customStatus = selectedUser.activities.find(a => a.type === 4);
              const otherActivities = selectedUser.activities.filter(a => a.type !== 4);

              return (
                <>
                  {/* Banner */}
                  <div style={{ 
                    width: '100%', height: '90px', 
                    borderRadius: '24px 24px 0 0',
                    backgroundImage: selectedUser.banner ? `url(${selectedUser.banner})` : 'none',
                    backgroundColor: selectedUser.accentColor || `${statusColor}44`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />

                  <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', marginTop: '-55px' }}>
                      <img 
                        src={selectedUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                        alt={selectedUser.username} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(30, 15, 50, 1)', objectFit: 'cover' }}
                      />
                      {selectedUser.avatarDecoration && (
                        <img 
                          src={selectedUser.avatarDecoration} 
                          alt="Decoration" 
                          style={{ position: 'absolute', top: '-15%', left: '-15%', width: '130%', height: '130%', pointerEvents: 'none', zIndex: 1 }}
                        />
                      )}
                      <div style={{ 
                        position: 'absolute', bottom: '2px', right: '2px', 
                        width: '24px', height: '24px', 
                        backgroundColor: statusColor, borderRadius: '50%', 
                        border: '4px solid rgba(30, 15, 50, 1)', zIndex: 2
                      }}></div>
                    </div>

                    {/* Name */}
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#fff', fontWeight: 'bold' }}>
                          {selectedUser.displayName || selectedUser.username}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '8px' }}>
                          {selectedUser.username === '9p7t' ? (
                            <>
                              <CrownBadge />
                              <ActiveDevBadge />
                              <BoosterBadge />
                            </>
                          ) : (
                            <ActiveDevBadge />
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>@{selectedUser.username}</span>
                        <button
                          onClick={(e) => copyToClipboard(e, selectedUser.username, setCopiedUser)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: copiedUser ? '#43b581' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s',
                          }}
                          title="Copy Discord Username"
                        >
                          {copiedUser ? <Check size={14} /> : <Copy size={14} />}
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

export default DiscordProfile;
