import React, { useEffect, useRef, useState } from 'react';

const MouseFollower = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);
  const rafRef = useRef(null);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    
    // Hide initially until mouse moves
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
        // Instantly snap ring to initial position to avoid gliding in from offscreen
        ringPosRef.current.x = e.clientX;
        ringPosRef.current.y = e.clientY;
      }

      // Update inner dot instantly on mousemove (keeps it tight to cursor)
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    };

    const onClick = (e) => {
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 600);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('click', onClick);

    // Dynamic animation loop for the outer ring trailing behind (lerp)
    const LERP_FACTOR = 0.15; // smooth drag speed
    const updateRing = () => {
      if (isVisibleRef.current && ring) {
        const dx = mouseRef.current.x - ringPosRef.current.x;
        const dy = mouseRef.current.y - ringPosRef.current.y;
        
        ringPosRef.current.x += dx * LERP_FACTOR;
        ringPosRef.current.y += dy * LERP_FACTOR;
        
        ring.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      rafRef.current = requestAnimationFrame(updateRing);
    };
    rafRef.current = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('click', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot - instant transform3d, gpu-accelerated */}
      <div ref={dotRef} style={{
        position: 'fixed',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#b200ff',
        boxShadow: '0 0 15px #b200ff, 0 0 30px rgba(178,0,255,0.4)',
        pointerEvents: 'none',
        zIndex: 999999,
        top: 0, left: 0,
        opacity: 0,
        transition: 'opacity 0.2s ease',
        willChange: 'transform',
      }} />

      {/* Outer ring - animated via requestAnimationFrame lerp, transform3d */}
      <div ref={ringRef} style={{
        position: 'fixed',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1.5px solid rgba(178,0,255,0.6)',
        boxShadow: '0 0 10px rgba(178,0,255,0.2)',
        pointerEvents: 'none',
        zIndex: 999999,
        top: 0, left: 0,
        opacity: 0,
        transition: 'opacity 0.2s ease',
        willChange: 'transform',
      }} />

      {/* Click ripples */}
      {clicks.map(c => (
        <div key={c.id} style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '10px', height: '10px',
          borderRadius: '50%',
          border: '2px solid #b200ff',
          transform: `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`,
          pointerEvents: 'none',
          zIndex: 999999,
          animation: 'clickRipple 0.6s ease-out forwards',
        }} />
      ))}

      <style>{`
        @keyframes clickRipple {
          0% { width: 10px; height: 10px; opacity: 1; border-width: 2px; }
          100% { width: 80px; height: 80px; opacity: 0; border-width: 0.5px; }
        }
      `}</style>
    </>
  );
};

export default MouseFollower;
