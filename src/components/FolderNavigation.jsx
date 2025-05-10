import { useState } from 'react';
import { useFileFolderContext } from '../context/FileFolderContext';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const FolderNavigation = () => {
  const { 
    folders, 
    currentFolderId, 
    folderPath, 
    navigateToFolder, 
    createFolder,
    FolderIcon
  } = useFileFolderContext();
  
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  const PlusIcon = getIcon("Plus");
  const ChevronRightIcon = getIcon("ChevronRight");
  const HomeIcon = getIcon("Home");
  const CheckIcon = getIcon("Check");
  const XIcon = getIcon("X");
  
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName('');
    }
    setIsCreatingFolder(false);
  };

  const subfolders = folders.filter(folder => folder.parentId === currentFolderId);
  
  return (
    <div className="mb-6 space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center flex-wrap gap-1 text-sm">
        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            {index === 0 ? (
              <button 
                onClick={() => navigateToFolder(folder.id)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-md transition-colors"
                aria-label="Navigate to root folder"
              >
                <HomeIcon size={16} />
                <span>{folder.name}</span>
              </button>
            ) : (
              <>
                <ChevronRightIcon size={16} className="text-surface-400 mx-1" />
                <button 
                  onClick={() => navigateToFolder(folder.id)}
                  className="px-2 py-1 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-md transition-colors"
                >
                  {folder.name}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Folder actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-surface-800 dark:text-surface-100">
          {subfolders.length > 0 ? 'Folders' : 'No Folders'}
        </h3>
        
        {!isCreatingFolder ? (
          <button 
            className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm"
            onClick={() => setIsCreatingFolder(true)}
          >
            <PlusIcon size={16} />
            <span>New Folder</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="px-3 py-1.5 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
            <button 
              onClick={handleCreateFolder}
              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              aria-label="Create folder"
            >
              <CheckIcon size={16} />
            </button>
            <button 
              onClick={() => {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }}
              className="p-1.5 bg-surface-300 dark:bg-surface-600 hover:bg-surface-400 dark:hover:bg-surface-500 text-surface-700 dark:text-surface-200 rounded-lg transition-colors"
              aria-label="Cancel"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderNavigation;