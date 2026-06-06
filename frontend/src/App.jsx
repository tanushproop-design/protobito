import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Skills from './components/Skills';
import MyBots from './components/MyBots';
import Projects from './components/Projects';
import DiscordProfile from './components/DiscordProfile';
import ServerWidget from './components/ServerWidget';
import Contact from './components/Contact';
import MouseFollower from './components/MouseFollower';
import Starfield from './components/Starfield';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Initialize Lenis for smooth slow-motion scrolling
    const lenis = new Lenis({
      duration: 1.2, // Adjusted for smooth yet highly responsive scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    
    window.lenis = lenis;

    if (isLoading) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Sync scroll lock with isLoading state changes
  useEffect(() => {
    if (!isLoading) {
      window.lenis?.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } else {
      window.lenis?.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }, [isLoading]);

  return (
    <div style={{ position: 'relative', cursor: 'none' }}>
      <Starfield />
      <Loader onFinished={() => setIsLoading(false)} />
      <MouseFollower />
      <Hero />
      <DiscordProfile />
      <ServerWidget />
      <Skills />
      <MyBots />
      <Projects />
      <Contact />
      
      {/* Simple Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(138,43,226,0.2)', marginTop: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} - OBITO | Engineered with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;

