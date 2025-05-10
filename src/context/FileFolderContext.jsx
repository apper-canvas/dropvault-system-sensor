import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Create context
const FileFolderContext = createContext();

// Custom hook for using the context
export const useFileFolderContext = () => {
  const context = useContext(FileFolderContext);
  if (!context) {
    throw new Error('useFileFolderContext must be used within a FileFolderProvider');
  }
  return context;
};

// Provider component
export const FileFolderProvider = ({ children }) => {
  // State for files, folders and current navigation
  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem('dropvault_files');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });
  
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem('dropvault_folders');
    // Initialize with root folder if no folders exist
    return savedFolders ? JSON.parse(savedFolders) : [
      {
        id: 'root',
        name: 'My Files',
        parentId: null,
        path: '/root',
        createdAt: new Date().toISOString(),
        shared: false
      }
    ];
  });
  
  const [currentFolderId, setCurrentFolderId] = useState(() => {
    const savedCurrentFolder = localStorage.getItem('dropvault_currentFolder');
    return savedCurrentFolder || 'root';
  });
  
  const [folderPath, setFolderPath] = useState([]);
  const [sharedItems, setSharedItems] = useState(() => {
    const savedSharedItems = localStorage.getItem('dropvault_sharedItems');
    return savedSharedItems ? JSON.parse(savedSharedItems) : [];
  });
  
  // Icon reference
  const FolderIcon = getIcon("Folder");
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('dropvault_files', JSON.stringify(files));
  }, [files]);
  
  useEffect(() => {
    localStorage.setItem('dropvault_folders', JSON.stringify(folders));
  }, [folders]);
  
  useEffect(() => {
    localStorage.setItem('dropvault_currentFolder', currentFolderId);
  }, [currentFolderId]);
  
  useEffect(() => {
    localStorage.setItem('dropvault_sharedItems', JSON.stringify(sharedItems));
  }, [sharedItems]);
  
  // Calculate folder path whenever current folder changes
  useEffect(() => {
    const generatePath = (folderId) => {
      const result = [];
      let currentId = folderId;
      
      while (currentId) {
        const folder = folders.find(f => f.id === currentId);
        if (!folder) break;
        
        result.unshift({
          id: folder.id,
          name: folder.name
        });
        
        currentId = folder.parentId;
      }
      
      return result;
    };
    
    setFolderPath(generatePath(currentFolderId));
  }, [currentFolderId, folders]);
  
  // Folder Operations
  const createFolder = useCallback((folderName) => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    // Check if folder with same name exists in current folder
    const folderExists = folders.some(f => 
      f.parentId === currentFolderId && 
      f.name.toLowerCase() === folderName.toLowerCase()
    );
    
    if (folderExists) {
      toast.error(`Folder "${folderName}" already exists`);
      return;
    }
    
    const newFolder = {
      id: `folder_${Date.now()}`,
      name: folderName,
      parentId: currentFolderId,
      path: `${folderPath.map(f => f.name).join('/')}/${folderName}`,
      createdAt: new Date().toISOString(),
      shared: false
    };
    
    setFolders(prev => [...prev, newFolder]);
    toast.success(`Folder "${folderName}" created`);
    
    return newFolder;
  }, [currentFolderId, folders, folderPath]);
  
  const navigateToFolder = useCallback((folderId) => {
    setCurrentFolderId(folderId);
  }, []);
  
  // File Operations
  const addFiles = useCallback((newFiles) => {
    const filesWithFolder = newFiles.map(file => ({
      ...file,
      folderId: currentFolderId,
      folderPath: folderPath.map(f => f.name).join('/'),
      shared: false,
      addedAt: new Date().toISOString()
    }));
    
    setFiles(prev => [...prev, ...filesWithFolder]);
    return filesWithFolder;
  }, [currentFolderId, folderPath]);
  
  const removeFile = useCallback((fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
    
    // Also remove from shared items if it exists
    setSharedItems(prev => prev.filter(item => 
      !(item.type === 'file' && item.itemId === fileId)
    ));
    
    toast.info("File removed");
  }, [files]);
  
  const removeFolder = useCallback((folderId) => {
    // Check if folder has files or subfolders
    const hasFiles = files.some(file => file.folderId === folderId);
    const hasSubfolders = folders.some(folder => folder.parentId === folderId);
    
    if (hasFiles || hasSubfolders) {
      toast.error("Cannot delete folder with files or subfolders");
      return false;
    }
    
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    // Also remove from shared items if it exists
    setSharedItems(prev => prev.filter(item => 
      !(item.type === 'folder' && item.itemId === folderId)
    ));
    
    toast.info("Folder removed");
    return true;
  }, [files, folders]);
  
  // Sharing operations
  const shareItem = useCallback((type, itemId, shareSettings) => {
    const newShare = {
      shareId: `share_${Date.now()}`,
      type, // 'file' or 'folder'
      itemId,
      settings: {
        ...shareSettings,
        createdAt: new Date().toISOString()
      }
    };
    
    setSharedItems(prev => [...prev, newShare]);
    
    // Update the shared status on the item
    if (type === 'file') {
      setFiles(prev => prev.map(file => 
        file.id === itemId ? { ...file, shared: true } : file
      ));
    } else if (type === 'folder') {
      setFolders(prev => prev.map(folder => 
        folder.id === itemId ? { ...folder, shared: true } : folder
      ));
    }
    
    return newShare;
  }, []);
  
  const removeShare = useCallback((shareId) => {
    const share = sharedItems.find(item => item.shareId === shareId);
    if (!share) return;
    
    setSharedItems(prev => prev.filter(item => item.shareId !== shareId));
    
    // Update the shared status on the item if it's not shared elsewhere
    const itemId = share.itemId;
    const stillShared = sharedItems.some(item => item.itemId === itemId && item.shareId !== shareId);
    
    if (!stillShared) {
      if (share.type === 'file') {
        setFiles(prev => prev.map(file => file.id === itemId ? { ...file, shared: false } : file));
      } else if (share.type === 'folder') {
        setFolders(prev => prev.map(folder => folder.id === itemId ? { ...folder, shared: false } : folder));
      }
    }
  }, [sharedItems]);
  
  return (
    <FileFolderContext.Provider value={{ files, folders, currentFolderId, folderPath, sharedItems, createFolder, navigateToFolder, addFiles, removeFile, removeFolder, shareItem, removeShare, FolderIcon }}>
      {children}
    </FileFolderContext.Provider>
  );
};