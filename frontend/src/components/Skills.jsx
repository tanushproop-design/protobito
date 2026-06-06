import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skills = [
    { name: 'Python', level: 80, color: '#3776AB' },
    { name: 'Java', level: 90, color: '#007396' },
    { name: 'React', level: 70, color: '#61DAFB' },
    { name: 'Node.js', level: 85, color: '#339933' },
    { name: 'Discord API', level: 95, color: '#5865F2' },
  ];

  return (
    <section className="container" style={{ padding: '100px 2rem', minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
          My <span className="text-gradient text-glow">Arsenal</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {skills.map((skill, index) => (
            <motion.div 
              key={index}
              className="glass-panel"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>{skill.name}</h3>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{skill.level}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                  style={{ height: '100%', background: `linear-gradient(90deg, var(--accent-purple), var(--accent-neon))`, borderRadius: '4px', boxShadow: '0 0 10px rgba(138,43,226,0.5)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
