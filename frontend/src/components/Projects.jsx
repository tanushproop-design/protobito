import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ExternalLink } from 'lucide-react';
import useTilt from '../hooks/useTilt';

const ProjectCard = ({ project, index }) => {
  const tiltRef = useTilt({ maxTilt: 8, scale: 1.02 });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ height: '100%' }}
    >
      <div
        ref={tiltRef}
        className="glass-panel"
        style={{ 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative', 
          overflow: 'hidden',
          height: '100%',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <FolderGit2 size={40} color="var(--accent-purple)" />
          {project.link && project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
              <ExternalLink size={24} className="hover:text-white transition-colors" />
            </a>
          )}
        </div>
        
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{project.title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>
          {project.description}
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
          {project.tech.map((tech, i) => (
            <span key={i} style={{ fontSize: '0.875rem', color: 'var(--accent-neon)', background: 'rgba(178,0,255,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from our backend
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
        // Fallback data if backend is not running
        setProjects([
          {
            id: 1,
            title: 'Python AI Bot',
            description: 'A machine learning powered Discord bot built with Python and TensorFlow. Features predictive text generation and image recognition.',
            tech: ['Python', 'TensorFlow', 'Discord.py'],
            link: '#'
          },
          {
            id: 2,
            title: 'Java Spring API',
            description: 'A scalable RESTful API built with Java Spring Boot and PostgreSQL, featuring secure JWT authentication and high performance.',
            tech: ['Java', 'Spring Boot', 'PostgreSQL'],
            link: '#'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="container" style={{ padding: '100px 2rem', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
          Featured <span className="text-gradient text-glow">Projects</span>
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--accent-purple)' }}>Loading projects...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
