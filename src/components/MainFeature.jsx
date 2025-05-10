import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileFolderContext } from '../context/FileFolderContext';
import FolderNavigation from './FolderNavigation';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon declarations
  const UploadCloudIcon = getIcon("UploadCloud");
  const FileIcon = getIcon("File");
  const ImageIcon = getIcon("Image");
  const FileTextIcon = getIcon("FileText");
  const FilePlusIcon = getIcon("FilePlus");
  const AlertCircleIcon = getIcon("AlertCircle");
  const CheckCircleIcon = getIcon("CheckCircle");
  const FolderOpenIcon = getIcon("FolderOpen");
  const TrashIcon = getIcon("Trash");
  
  const ShareIcon = getIcon("Share2");
  
  // Use file/folder context
  const { 
    currentFolderId, 
    addFiles, 
    files: contextFiles, 
    removeFile,
  } = useFileFolderContext();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const processFiles = (newFiles) => {
    const updatedFiles = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'ready',
      uploaded: false
    }));
    
    
    // Also add to context once "uploaded"
    if (!uploading) {
      toast.success(`${newFiles.length} files added to upload queue`);
    }
    toast.success(`${newFiles.length} files added to upload queue`);
  };

  const removeQueuedFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
    toast.info("File removed from upload queue");
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon size={20} />;
    } else if (fileType.startsWith('text/') || fileType.includes('document')) {
      return <FileTextIcon size={20} />;
    } else {
      return <FileIcon size={20} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUpload = () => {
    if (files.length === 0) {
      toast.warning("No files to upload", {
        icon: <span className="text-yellow-500"><AlertCircleIcon size={20} /></span>
      });
      return;
    }
    
    if (uploading) {
      toast.info("Upload already in progress");
      return;
    }
    
    setUploading(true);
    
    // Simulate file upload progress
    let updatedFiles = [...files];
    
    const interval = setInterval(() => {
      updatedFiles = updatedFiles.map(file => {
        if (file.progress < 100) {
          const progressIncrement = Math.floor(Math.random() * 10) + 5;
          const newProgress = Math.min(file.progress + progressIncrement, 100);
          
          if (newProgress === 100) {
            return {
              ...file,
              progress: newProgress,
              status: 'complete',
              uploaded: true
              
            };
          }
          
          return {
            ...file,
            progress: newProgress,
            status: 'uploading'
          };
        }
        return file;
      });
      
      setFiles(updatedFiles);
      
      // Check if all files are done uploading
      if (updatedFiles.every(file => file.progress === 100)) {
        clearInterval(interval);
        setUploading(false);
        
        // Add successfully uploaded files to context
        const completedFiles = updatedFiles.filter(file => file.status === 'complete');
        addFiles(completedFiles);
        
        toast.success("All files uploaded successfully", {
          icon: <span className="text-green-500"><CheckCircleIcon size={20} /></span>
        });
      }
    }, 500);
  };
  
  return (
    <div>
      <FolderNavigation />
      
      <div className="rounded-2xl bg-white dark:bg-surface-800 shadow-card overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-surface-900 dark:text-white flex items-center gap-2">
          File Uploader
        </h2>
        
        {/* Drag & Drop Zone */}
        <div
          className={`
            relative mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-surface-300 dark:border-surface-600 hover:border-primary dark:hover:border-primary hover:bg-surface-50 dark:hover:bg-surface-700/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileInputChange}
            multiple
          />
          
          <div className="flex flex-col items-center justify-center py-4">
            <motion.div 
              className="text-primary dark:text-primary-light mb-4"
              animate={{ 
                y: isDragging ? [-5, 0, -5] : 0,
              }}
              transition={{
                repeat: isDragging ? Infinity : 0,
                duration: 1.5
              }}
            >
              <UploadCloudIcon size={48} />
            </motion.div>
            
            <h3 className="text-lg font-medium mb-2 text-surface-800 dark:text-surface-100">
              {isDragging ? 'Drop files here' : 'Drag & Drop your files here'}
            </h3>
            
            <p className="text-surface-500 dark:text-surface-400 mb-4 max-w-md mx-auto">
              Or click the button below to browse your files
            </p>
            
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <FilePlusIcon size={18} />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
        
        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-100">
                Files to Upload ({files.length})
              </h3>
              
              <button
                type="button"
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${uploading 
                    ? 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                  }
                `}
                onClick={simulateUpload}
                disabled={uploading}
              >
                <UploadCloudIcon size={18} />
                <span>{uploading ? 'Uploading...' : 'Start Upload'}</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-50 dark:bg-surface-700/40 rounded-lg"
                  >
                    <div className="flex items-start gap-3 mb-3 sm:mb-0">
                      <div className={`
                        p-2 rounded-lg flex-shrink-0
                        ${file.status === 'complete' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                        }
                      `}>
                        {getFileIcon(file.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate text-surface-900 dark:text-surface-100 mb-1 pr-4">
                          {file.name}
                        </h4>
                        <div className="flex gap-3 flex-wrap text-xs text-surface-500 dark:text-surface-400">
                          <span>{formatFileSize(file.size)}</span>
                          {file.status === 'complete' && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Uploaded
                            </span>
                          )}
                          {file.status === 'uploading' && (
                            <span className="text-primary dark:text-primary-light font-medium">
                              Uploading...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {file.status !== 'complete' && (
                        <div className="w-full sm:w-32 h-2 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      
                      {!uploading && file.status !== 'uploading' && (
                        <button
                          onClick={() => removeQueuedFile(file.id)}
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                          aria-label="Remove file"
                        >
                          <TrashIcon size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      
      {/* Files in current folder */}
      {contextFiles.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white dark:bg-surface-800 shadow-card overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-surface-900 dark:text-white flex items-center gap-2">
              <FolderOpenIcon size={22} />
              <span>Files in current folder</span>
            </h2>
            
            <div className="overflow-hidden">
              <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                <div className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <div className="bg-surface-100 dark:bg-surface-800">
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      <div className="col-span-6">Name</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    <AnimatePresence>
                      {contextFiles
                        .filter(file => file.folderId === currentFolderId)
                        .map(file => (
                        <motion.div 
                          key={file.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-12 gap-2 px-4 py-3 text-sm text-surface-900 dark:text-surface-100"
                        >
                          <div className="col-span-6 flex items-center space-x-3">
                            <div className={`
                              p-2 rounded-lg flex-shrink-0
                              bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300
                            `}>
                              {getFileIcon(file.type)}
                            </div>
                            <div className="truncate">
                              <p className="font-medium">{file.name}</p>
                            </div>
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            {formatFileSize(file.size)}
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            {file.shared ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary rounded text-xs">
                                <ShareIcon size={12} />
                                <span>Shared</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">
                                <CheckCircleIcon size={12} />
                                <span>Uploaded</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="col-span-2 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1.5 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                              aria-label="Delete file"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default MainFeature;