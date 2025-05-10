import { useState } from 'react';
import MainFeature from '../components/MainFeature';
import FolderGrid from '../components/FolderGrid';
import getIcon from '../utils/iconUtils';
import { FileFolderProvider } from '../context/FileFolderContext';
import { motion } from 'framer-motion';

const Home = () => {
  // Icon declarations
  const FolderIcon = getIcon("Folder");
  const ShieldIcon = getIcon("Shield");
  const ShareIcon = getIcon("Share2");
  
  const features = [
    {
      id: 1,
      title: "Organized Storage",
      description: "Keep your files neatly organized with folders, tags, and smart search functionality.",
      icon: <FolderIcon size={24} />
    },
    {
      id: 2,
      title: "Secure Files",
      description: "Your data is encrypted and protected with industry-standard security measures.",
      icon: <ShieldIcon size={24} />
    },
    {
      id: 3,
      title: "Easy Sharing",
      description: "Share files with customizable access permissions and expiring links.",
      icon: <ShareIcon size={24} />
    }
  ];

  return (
    <FileFolderProvider>
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-white tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Manage Your Files with Ease
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mt-4 text-balance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload, organize, and share your files securely with DropVault's intuitive interface.
        </motion.p>
      </section>

      <div className="my-12">
        <MainFeature />
      </div>
      
      <div className="my-8">
        <FolderGrid />
      </div>
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              className="p-6 rounded-2xl bg-white dark:bg-surface-800 shadow-neu-light dark:shadow-neu-dark hover:translate-y-[-5px] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * feature.id }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-surface-900 dark:text-white">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </FileFolderProvider>
  );
};

export default Home;