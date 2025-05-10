import { useState } from 'react';
import { useFileFolderContext } from '../context/FileFolderContext';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { format } from 'date-fns';
import ShareModal from './ShareModal';

const FolderGrid = () => {
  const { 
    folders, 
    currentFolderId, 
    navigateToFolder, 
    removeFolder,
    FolderIcon
  } = useFileFolderContext();
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Get only folders in the current folder
  const subfolders = folders.filter(folder => folder.parentId === currentFolderId);
  
  // Icon declarations
  const MoreVerticalIcon = getIcon("MoreVertical");
  const TrashIcon = getIcon("Trash");
  const ShareIcon = getIcon("Share2");
  const ShieldIcon = getIcon("Shield");
  
  const handleShare = (folder) => {
    setSelectedItem({
      id: folder.id,
      name: folder.name,
      type: 'folder'
    });
    setShowShareModal(true);
  };
  
  const handleDelete = (folderId) => {
    removeFolder(folderId);
  };
  
  if (subfolders.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {subfolders.map((folder) => {
            // Don't show root folder
            if (folder.id === 'root') return null;
            
            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="p-4 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigateToFolder(folder.id)}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                        <FolderIcon size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-surface-900 dark:text-white truncate max-w-[160px]">
                          {folder.name}
                        </h3>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {format(new Date(folder.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        className="p-1.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                        aria-label="Folder options"
                      >
                        <MoreVerticalIcon size={16} />
                      </button>
                      
                      <div className="invisible group-hover:visible absolute right-0 top-full mt-1 w-36 py-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 shadow-lg z-10">
                        <button
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                          onClick={() => handleShare(folder)}
                        >
                          <ShareIcon size={14} />
                          <span>Share</span>
                        </button>
                        <button
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          onClick={() => handleDelete(folder.id)}
                        >
                          <TrashIcon size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {folder.shared && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded text-xs">
                      <ShieldIcon size={12} />
                      <span>Shared</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {showShareModal && selectedItem && (
        <ShareModal item={selectedItem} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default FolderGrid;