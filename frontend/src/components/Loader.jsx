import { motion } from 'framer-motion';

const Loader = () => (
  <motion.div
    className="loader-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '3px solid #e2e8f0',
        borderTopColor: '#6366f1',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </motion.div>
);

export default Loader;
