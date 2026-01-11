import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaBrain,
  FaNetworkWired,
  FaDatabase,
  FaLock
} from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { colors, effects } from '../colors/colors';

const Preloadre = () => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [showAnomaly, setShowAnomaly] = useState(false);
  const [scanData, setScanData] = useState([]);

  const stages = [
    { text: 'Initializing Neural Network', icon: FaBrain },
    { text: 'Loading AI Models', icon: FaDatabase },
    { text: 'Establishing Connection', icon: FaNetworkWired },
    { text: 'Scanning for Anomalies', icon: FaExclamationTriangle },
    { text: 'Securing System', icon: FaLock },
    { text: 'System Ready', icon: FaShieldAlt }
  ];

  // Progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Stage progression
  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage(prev => (prev >= stages.length - 1 ? prev : prev + 1));
    }, 800);
    return () => clearInterval(stageTimer);
  }, []);

  // Anomaly detection
  useEffect(() => {
    if (stage === 3) {
      setShowAnomaly(true);
      setTimeout(() => setShowAnomaly(false), 2000);
    }
  }, [stage]);

  // Scanning data
  useEffect(() => {
    const interval = setInterval(() => {
      setScanData(prev => {
        const spike = showAnomaly ? Math.random() * 40 + 60 : 0;
        const newData = [...prev, { value: Math.random() * 50 + 20 + spike }];
        return newData.slice(-25);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [showAnomaly]);

  const CurrentIcon = stages[stage].icon;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `radial-gradient(ellipse at center, ${colors.surface} 0%, ${colors.background} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${colors.border} 1px, transparent 1px),
          linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.2
      }} />

      {/* Floating Particles */}
      {[...Array(200)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: colors.primary,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '90%',
        maxWidth: 600,
        textAlign: 'center'
      }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 50 }}
        >
          <h1 style={{
            fontSize: 48,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 10,
            letterSpacing: 4
          }}>
            AI SENTINEL
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: 3
          }}>
            Public Fraud Detection System
          </p>
        </motion.div>
<motion.div
          key={stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: colors.surface,
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            padding: '14px 24px',
            marginBottom: 25,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div style={{
            width: 8,
            height: 8,
            background: colors.primary,
            borderRadius: '50%',
            boxShadow: `0 0 10px ${colors.primary}`
          }} />
          <span style={{
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: 500
          }}>
            {stages[stage].text}...
          </span>
        </motion.div>
        {/* Main Icon Circle */}
        <div style={{
          position: 'relative',
          width: 180,
          height: 180,
          margin: '0 auto 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Outer Rings */}
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              style={{
                position: 'absolute',
                width: 180 - ring * 30,
                height: 180 - ring * 30,
                border: `2px solid ${
                  showAnomaly ? colors.anomaly : 
                  ring === 0 ? colors.primary : 
                  ring === 1 ? colors.secondary : 
                  colors.accent
                }`,
                borderRadius: '50%',
                opacity: 0.5
              }}
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2 + ring * 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Center Icon */}
          <motion.div
            style={{
              width: 100,
              height: 100,
              background: colors.surface,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${showAnomaly ? colors.anomaly : colors.primary}`,
              boxShadow: showAnomaly ? effects.anomalyGlow : effects.primaryGlow,
              zIndex: 2
            }}
            animate={{
              boxShadow: showAnomaly 
                ? [effects.anomalyGlow, `0 0 40px ${colors.anomaly}`, effects.anomalyGlow]
                : [effects.primaryGlow, `0 0 40px ${colors.primary}`, effects.primaryGlow]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CurrentIcon 
              size={45} 
              color={showAnomaly ? colors.anomaly : colors.primary}
            />
          </motion.div>

          {/* Corner Status Icons */}
          {[
            { Icon: FaBrain, angle: 0, active: stage >= 0 },
            { Icon: FaDatabase, angle: 90, active: stage >= 1 },
            { Icon: FaNetworkWired, angle: 180, active: stage >= 2 },
            { Icon: FaLock, angle: 270, active: stage >= 4 }
          ].map(({ Icon, angle, active }, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 36,
                height: 36,
                background: colors.surface,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${active ? colors.primary : colors.border}`,
                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 90}px - 18px)`,
                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 90}px - 18px)`,
                boxShadow: active ? `0 0 15px ${colors.primary}40` : 'none'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <Icon size={16} color={active ? colors.primary : colors.textDisabled} />
            </motion.div>
          ))}
        </div>

        {/* Anomaly Alert */}
        <AnimatePresence>
          {showAnomaly && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                background: colors.surface,
                border: `2px solid ${colors.anomaly}`,
                borderRadius: 12,
                padding: '12px 24px',
                marginBottom: 30,
                boxShadow: effects.anomalyGlow,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <FaExclamationTriangle size={20} color={colors.anomaly} />
              <span style={{
                color: colors.anomaly,
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 1
              }}>
                ANOMALY DETECTED
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Data Chart */}

        {/* Status Text */}
        

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: 10,
          background: colors.surface,
          borderRadius: 5,
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          marginBottom: 20
        }}>
          <motion.div
            style={{
              height: '100%',
              background: showAnomaly
                ? `linear-gradient(90deg, ${colors.anomaly}, ${colors.warning})`
                : `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
              boxShadow: `0 0 15px ${showAnomaly ? colors.anomaly : colors.primary}`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Percentage */}
        <motion.div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: showAnomaly ? colors.anomaly : colors.primary,
            fontFamily: 'monospace',
            letterSpacing: 3
          }}
          animate={{
            textShadow: [
              `0 0 20px ${showAnomaly ? colors.anomaly : colors.primary}`,
              `0 0 35px ${showAnomaly ? colors.anomaly : colors.primary}`,
              `0 0 20px ${showAnomaly ? colors.anomaly : colors.primary}`
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {progress}%
        </motion.div>

        {/* System Status Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginTop: 30
        }}>
          {[
            { label: 'Neural Net', active: stage >= 0 },
            { label: 'Anomaly Scan', active: stage >= 3 },
            { label: 'Secure Link', active: stage >= 4 }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              style={{
                background: colors.surface,
                border: `1px solid ${item.active ? colors.primary : colors.border}`,
                borderRadius: 8,
                padding: 12,
                boxShadow: item.active ? `0 0 15px ${colors.primary}30` : 'none'
              }}
            >
              <div style={{
                width: 10,
                height: 10,
                background: item.active ? colors.primary : colors.textDisabled,
                borderRadius: '50%',
                margin: '0 auto 8px',
                boxShadow: item.active ? `0 0 10px ${colors.primary}` : 'none'
              }} />
              <div style={{
                fontSize: 10,
                color: item.active ? colors.textPrimary : colors.textDisabled,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                {item.label}
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default Preloadre;