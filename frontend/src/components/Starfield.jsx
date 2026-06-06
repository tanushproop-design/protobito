import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Track resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Track mouse
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize 120 stars (slightly more for rich feel)
    const numStars = 120;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random(), // normalized coordinate (0 to 1)
        y: Math.random(), // normalized coordinate (0 to 1)
        size: Math.random() * 2.2 + 0.6,
        twinkleSpeed: Math.random() * 0.0012 + 0.0004, // 10x slower for a premium, majestic feel
        twinklePhase: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.5 + 0.4,
        // Animated offsets for smooth repel effect
        offsetX: 0,
        offsetY: 0,
      });
    }
    starsRef.current = stars;

    const REPEL_RADIUS = 150;
    const REPEL_STRENGTH = 45;
    const LERP_FACTOR = 0.1; // Smooth glide back and forth

    const animate = (time) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear canvas with slight alpha to check if background can show through
      // But standard is clearRect since body background handles gradient
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      starsRef.current.forEach((star) => {
        // Base star coordinate on screen
        const sx = star.x * width;
        const sy = star.y * height;

        // Vector from mouse to star
        const dx = sx - mx;
        const dy = sy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetOffsetX = 0;
        let targetOffsetY = 0;

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          const angle = Math.atan2(dy, dx);
          targetOffsetX = Math.cos(angle) * force;
          targetOffsetY = Math.sin(angle) * force;
        }

        // Smoothly interpolate current offset towards target offset
        star.offsetX += (targetOffsetX - star.offsetX) * LERP_FACTOR;
        star.offsetY += (targetOffsetY - star.offsetY) * LERP_FACTOR;

        // Final positions
        const finalX = sx + star.offsetX;
        const finalY = sy + star.offsetY;

        // Twinkle calculation: oscillates smoothly between 0.15 and 1.0 (never negative, preventing pop-outs)
        const opacity = star.baseOpacity * (0.15 + 0.85 * (Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5));

        // Draw star
        ctx.beginPath();
        ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);

        if (star.size > 1.5) {
          // Add a premium soft glow around larger stars
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(178, 0, 255, 0.6)';
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        }
        
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
};

export default Starfield;
