import { useEffect, useRef } from 'react';

export const useTilt = (options = {}) => {
  const elementRef = useRef(null);

  const {
    maxTilt = 10,       // Max tilt rotation in degrees
    perspective = 1000, // Perspective in pixels
    scale = 1.02,       // Scale element on hover
    speed = 400,        // Transition speed back to normal on leave in ms
    easing = "cubic-bezier(.03,.98,.52,.99)" // Easing transition
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Apply basic transitions
    el.style.willChange = 'transform';

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      
      const width = rect.width;
      const height = rect.height;
      
      // Get mouse position relative to card (0 to width/height)
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to normalized coordinates (-0.5 to 0.5)
      const normalizedX = (x / width) - 0.5;
      const normalizedY = (y / height) - 0.5;
      
      // Calculate rotation
      const tiltX = (normalizedY * maxTilt * -1).toFixed(2);
      const tiltY = (normalizedX * maxTilt).toFixed(2);
      
      // Apply transforms with no transition for instantaneous tracking
      el.style.transition = 'none';
      el.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const handleMouseLeave = () => {
      // Smoothly animate back to initial state
      el.style.transition = `transform ${speed}ms ${easing}`;
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const handleMouseEnter = () => {
      // Smooth initial tilt transition to prevent a jump
      el.style.transition = `transform 150ms ease-out`;
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [maxTilt, perspective, scale, speed, easing]);

  return elementRef;
};

export default useTilt;
