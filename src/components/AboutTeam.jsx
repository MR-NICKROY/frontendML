
import { motion } from 'framer-motion';
import { FiCpu, FiCode, FiAward, FiActivity } from 'react-icons/fi'; 
import User1 from "../image/3.png";
import User2 from "../image/2.png";
import User3 from "../image/1.png";
import User4 from "../image/4.png";

// --- THEME CONFIG ---
const theme = {
  bg: '#0B1120',          
  surface: '#151B2B',     
  primary: '#5865F2',     
  text: '#FFFFFF',        
  textMuted: '#94A3B8',   
  border: '#1E293B',      
  accent: '#10B981'       
};

const teamMembers = [
  {
    name: 'Abhishek',
    role: 'Team Leader & ML Architect',
    focus: 'Machine Learning + AI + Strategy',
    icon: FiAward,
    image: User2, // Assigned User2
    desc: 'The visionary leader behind the entire project lifecycle. He led the high-level architectural design of the AI models and synthesized complex public sector data into actionable security strategies. His leadership ensured the project remained aligned with global fraud detection standards while mentoring the team through algorithmic challenges.',
    tags: ['Leadership', 'TensorFlow', 'Presentation']
  },
{
    name: 'Nilesh',
    role: 'AI Researcher',
    focus: 'Machine Learning + AI + Documentation',
    icon: FiCpu,
    image: User4,
    desc: 'The heartbeat of the system’s intelligence. Nilesh orchestrates the entire ML lifecycle, executing rigorous training epochs and exhaustive adversarial testing protocols. He engineered the core learning algorithms and fine-tuned the model to achieve state-of-the-art accuracy. His relentless optimization and stress-testing ensure the AI performs with surgical precision, making it the best-in-class defense against fraud.',
    tags: ['Data Science', 'Python', 'Model Tuning']
  },
{
    name: 'Nikhil',
    role: 'Lead Full Stack Architect',
    focus: 'The Code Engine (End-to-End)',
    icon: FiCode,
    image: User1,
    desc: 'The powerhouse behind the code. Nikhil is the sole architect and developer who built the entire ecosystem from the ground up. He single-handedly engineered the high-performance Node.js APIs, designed the optimized database schema, and crafted the responsive React dashboard. His complete ownership of the stack—from server-side logic to client-side rendering—ensured a unified, secure, and lightning-fast platform.',
    tags: ['Sole Developer', 'Full Stack', 'System Architecture']
  },
 {
    name: 'Nitin',
    role: 'Product Strategist & UI/UX',
    focus: 'Research + Design + Integration',
    icon: FiActivity, // Changed icon to represent Strategy/Activity
    image: User3,
    desc: 'The strategic visionary who bridged the gap between complex AI logic and user-centric design. Nitin led the comprehensive research phase, translating technical constraints into a seamless UI/UX roadmap. He masterminded the project’s visual storytelling and documentation, ensuring that the sophisticated fraud detection engine was presented with clarity, impact, and business value. His work transformed raw code into a polished, production-ready product.',
    tags: ['UI/UX Strategy', 'Research', 'Product Design']
  },

];
const styles = `
  .team-section { background-color: ${theme.bg}; padding: 100px 40px; font-family: 'Inter', sans-serif; color: ${theme.text}; position: relative; overflow: hidden; }
  .team-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .section-header { text-align: center; max-width: 800px; margin: 0 auto 60px auto; }
  .section-header h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 20px; }
  .section-header p { color: ${theme.textMuted}; font-size: 1.1rem; line-height: 1.6; }
  .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
  .team-card { background-color: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 16px; padding: 30px 20px; text-align: center; position: relative; overflow: hidden; transition: transform 0.3s ease; display: flex; flex-direction: column; height: 100%; }
  .team-card:hover { border-color: ${theme.primary}80; }
  .avatar-wrapper { width: 100px; height: 100px; margin: 0 auto 20px auto; position: relative; }
  .avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 3px solid ${theme.primary}; background-color: ${theme.bg}; object-fit: cover; }
  .role-icon-badge { position: absolute; bottom: 0; right: 0; background-color: ${theme.surface}; border: 1px solid ${theme.border}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: ${theme.primary}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
  .member-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; }
  .member-role { color: ${theme.primary}; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; display: block; }
  .member-focus { display: inline-block; background-color: ${theme.bg}; color: ${theme.textMuted}; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; margin-bottom: 16px; border: 1px solid ${theme.border}; }
  .member-desc { color: ${theme.textMuted}; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; flex-grow: 1; }
  .tags-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: auto; }
  .tech-tag { font-size: 0.75rem; color: ${theme.text}; background-color: ${theme.primary}15; padding: 4px 10px; border-radius: 4px; border: 1px solid ${theme.primary}30; }
  @media (max-width: 1200px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .team-grid { grid-template-columns: 1fr; } .section-header h2 { font-size: 2rem; } }
`;

const AboutTeam = () => {
  return (
    <section className="team-section">
      <style>{styles}</style>
      
      {/* --- GRID + PARTICLES BACKGROUND --- */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0,
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
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

      <div className="team-container">
        <motion.div className="section-header" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Forged in Code. Driven by Security.</h2>
          <p>We are a team of 4 dedicated engineers who turned sleepless nights into a robust defense system. From training complex neural networks to architecting seamless full-stack interfaces, every line of code represents our unwavering commitment to public safety and digital integrity.</p>
        </motion.div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <motion.div key={member.name} className="team-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -10 }}>
              <div className="avatar-wrapper">
                <img src={member.image} alt={member.name} className="avatar-img" />
                <div className="role-icon-badge"><member.icon size={16} /></div>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role">{member.role}</span>
              <span className="member-focus">{member.focus}</span>
              <p className="member-desc">{member.desc}</p>
              <div className="tags-container">
                {member.tags.map(tag => <span key={tag} className="tech-tag">#{tag}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;