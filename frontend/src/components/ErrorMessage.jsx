import { motion, AnimatePresence } from 'framer-motion';

const ErrorMessage = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        className="error-message"
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ErrorMessage;
