import { motion } from 'framer-motion';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        pointerEvents: 'none'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '0.2em' }} className="text-gradient">
          SYSTEM_ONLINE
        </h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'linear' }}
          style={{ height: '2px', background: 'var(--accent-primary)', marginTop: '1rem' }}
        />
      </motion.div>
    </motion.div>
  );
}
