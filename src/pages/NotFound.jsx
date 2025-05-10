import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon declarations
  const FileQuestionIcon = getIcon("FileQuestion");
  const HomeIcon = getIcon("Home");

  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-primary dark:text-primary-light mb-6 w-24 h-24 flex items-center justify-center"
      >
        <FileQuestionIcon size={96} />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-4 text-surface-900 dark:text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        404
      </motion.h1>
      
      <motion.h2 
        className="text-2xl md:text-3xl font-medium mb-6 text-surface-700 dark:text-surface-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        className="text-surface-600 dark:text-surface-400 max-w-md mb-8 text-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        The page you're looking for doesn't seem to exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors shadow-soft"
        >
          <HomeIcon size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;