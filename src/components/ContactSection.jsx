import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMail, FiMapPin, FiCheckCircle, FiLoader } from 'react-icons/fi';

// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  inputBg: '#0F1623',
  primary: '#5865F2',     
  text: '#FFFFFF',        
  textMuted: '#94A3B8',   
  border: '#1E293B',      
  success: '#10B981'
};

// --- STYLES ---
const styles = `
  .contact-section {
    background-color: ${theme.bg};
    padding: 100px 40px;
    font-family: 'Inter', sans-serif;
    color: ${theme.text};
    position: relative;
    overflow: hidden;
  }

  /* Modified to accommodate new particles (layered background) */
  .contact-section::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    /* We keep the original style but updated slightly for consistency */
    background-image: linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px);
    background-size: 50px 50px; opacity: 0.05; pointer-events: none; z-index: 0;
  }

  .contact-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; position: relative; z-index: 1; }
  .info-col h2 { font-size: 3rem; font-weight: 800; margin-bottom: 20px; line-height: 1.1; }
  .info-col p { color: ${theme.textMuted}; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px; }
  .contact-detail { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .icon-circle { width: 48px; height: 48px; background-color: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: ${theme.primary}; }
  .form-card { background-color: ${theme.surface}; padding: 40px; border-radius: 24px; border: 1px solid ${theme.border}; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .input-group { margin-bottom: 24px; position: relative; }
  .form-label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; color: ${theme.textMuted}; }
  .form-input, .form-textarea { width: 100%; background-color: ${theme.inputBg}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 16px; color: ${theme.text}; font-size: 1rem; font-family: inherit; transition: all 0.3s ease; outline: none; }
  .form-input:focus, .form-textarea:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 4px ${theme.primary}20; }
  .form-textarea { min-height: 150px; resize: vertical; }
  .submit-btn { width: 100%; padding: 16px; background-color: ${theme.primary}; color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s ease; }
  .submit-btn:hover { background-color: #4752c4; transform: translateY(-2px); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .success-message { text-align: center; padding: 40px 0; color: ${theme.success}; }
  @media (max-width: 1024px) { .contact-container { grid-template-columns: 1fr; gap: 40px; } .info-col h2 { font-size: 2.2rem; } .contact-section { padding: 60px 24px; } }
`;

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <section className="contact-section">
      <style>{styles}</style>
      
      {/* --- GRID + PARTICLES BACKGROUND --- */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {[...Array(300)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: theme.primary,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [-20, -40, -20], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="contact-container">
        <motion.div className="info-col" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Establish a Secure Connection.</h2>
          <p>Whether you are reporting a false positive, requesting API access, or interested in deploying CyberGuard for your municipality, our encrypted channels are open.</p>
          <div className="contact-detail">
            <div className="icon-circle"><FiMail size={20} /></div>
            <div><div style={{fontWeight: 'bold'}}>Email Support</div><div style={{color: theme.textMuted}}>Nikhilisdev@gmail.com</div></div>
          </div>
          <div className="contact-detail">
            <div className="icon-circle"><FiMapPin size={20} /></div>
            <div><div style={{fontWeight: 'bold'}}>HQ Location</div><div style={{color: theme.textMuted}}>Chhotu Ram Nagar, Bahadurgarh, Haryana India</div></div>
          </div>
        </motion.div>

        <motion.div className="form-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-message">
                <FiCheckCircle size={60} style={{ marginBottom: '20px' }} />
                <h3>Transmission Received</h3>
                <p style={{ color: theme.textMuted, marginTop: '10px' }}>Our team will review your message and respond via secure email within 24 hours.</p>
                <button onClick={() => setStatus('idle')} style={{ marginTop: '20px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.textMuted, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Send another message</button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}>
                <div className="input-group"><label htmlFor="name" className="form-label">Identity Name</label><input type="text" id="name" className="form-input" placeholder="ex. John Doe" required value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} /></div>
                <div className="input-group"><label htmlFor="email" className="form-label">Secure Email</label><input type="email" id="email" className="form-input" placeholder="name@organization.com" required value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} /></div>
                <div className="input-group"><label htmlFor="message" className="form-label">Transmission Message</label><textarea id="message" className="form-textarea" placeholder="Describe the anomaly or inquiry..." required value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} /></div>
                <button type="submit" className="submit-btn" disabled={status === 'loading'}>{status === 'loading' ? <><FiLoader className="spin-anim" /> Processing</> : <>Transmit Data <FiSend /></>}</button>
                <style>{`.spin-anim { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;