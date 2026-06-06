import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ username: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ username: '', email: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <>
      <section id="contact" className="container" style={{ padding: '100px 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
            Contact <span className="text-gradient text-glow">OBITO</span>
          </h2>

          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email (will send to nexa.8000@gmail.com)</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
                <textarea 
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '1rem' }} disabled={status === 'sending'}>
                <Send size={20} />
                {status === 'sending' ? 'Sending...' : 'Send Transmission'}
              </button>

              {status === 'success' && <p style={{ color: 'var(--accent-neon)', textAlign: 'center', marginTop: '1rem' }}>Message sent successfully!</p>}
              {status === 'error' && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>Failed to send message. Is backend running?</p>}
            </form>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;
