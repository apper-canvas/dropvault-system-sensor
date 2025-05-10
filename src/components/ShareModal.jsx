import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFileFolderContext } from '../context/FileFolderContext';
import getIcon from '../utils/iconUtils';

const ShareModal = ({ item, onClose }) => {
  const { shareItem } = useFileFolderContext();
  
  const [shareSettings, setShareSettings] = useState({
    access: 'view',
    expiration: 'never',
    customExpiration: '',
    requirePassword: false,
    password: '',
    allowedEmails: '',
    shareLink: ''
  });
  
  const [activeTab, setActiveTab] = useState('link');
  
  const XIcon = getIcon("X");
  const LinkIcon = getIcon("Link");
  const MailIcon = getIcon("Mail");
  const CopyIcon = getIcon("Copy");
  const ShieldIcon = getIcon("Shield");
  const KeyIcon = getIcon("Key");
  const ClockIcon = getIcon("Clock");
  const CheckIcon = getIcon("Check");
  const SendIcon = getIcon("Send");
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShareSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleShare = () => {
    // Validate settings
    if (shareSettings.requirePassword && !shareSettings.password) {
      toast.error("Please enter a password");
      return;
    }
    
    if (shareSettings.expiration === 'custom' && !shareSettings.customExpiration) {
      toast.error("Please select a custom expiration date");
      return;
    }
    
    if (activeTab === 'email' && !shareSettings.allowedEmails) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    // Create share
    const newShare = shareItem(item.type, item.id, shareSettings);
    
    // Generate a fake sharing link for demo purposes
    const shareLink = `https://dropvault.example.com/share/${newShare.shareId}`;
    setShareSettings(prev => ({ ...prev, shareLink }));
    
    if (activeTab === 'link') {
      toast.success("Share link created");
    } else {
      toast.success(`Share invitation sent to ${shareSettings.allowedEmails}`);
      onClose();
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareSettings.shareLink);
    toast.success("Link copied to clipboard");
  };
  
  // Modal backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div 
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            Share {item.type === 'folder' ? 'Folder' : 'File'}: {item.name}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-surface-200 dark:border-surface-700 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'link' 
                  ? 'border-primary text-primary dark:text-primary-light' 
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
              onClick={() => handleTabChange('link')}
            >
              <div className="flex items-center gap-2">
                <LinkIcon size={16} />
                <span>Share Link</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'email' 
                  ? 'border-primary text-primary dark:text-primary-light' 
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
              onClick={() => handleTabChange('email')}
            >
              <div className="flex items-center gap-2">
                <MailIcon size={16} />
                <span>Email Invite</span>
              </div>
            </button>
          </div>
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                <div className="flex items-center gap-1.5">
                  <ShieldIcon size={14} />
                  <span>Access Level</span>
                </div>
              </label>
              <select
                name="access"
                value={shareSettings.access}
                onChange={handleChange}
                className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="view">View only</option>
                <option value="comment">Comment & View</option>
                <option value="edit">Edit & View</option>
                <option value="admin">Full access</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                <div className="flex items-center gap-1.5">
                  <ClockIcon size={14} />
                  <span>Link Expiration</span>
                </div>
              </label>
              <select
                name="expiration"
                value={shareSettings.expiration}
                onChange={handleChange}
                className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="never">Never expires</option>
                <option value="1day">Expires in 1 day</option>
                <option value="7days">Expires in 7 days</option>
                <option value="30days">Expires in 30 days</option>
                <option value="custom">Custom date</option>
              </select>
              
              {shareSettings.expiration === 'custom' && (
                <input
                  type="date"
                  name="customExpiration"
                  value={shareSettings.customExpiration}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().split('T')[0]}
                />
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requirePassword"
                name="requirePassword"
                checked={shareSettings.requirePassword}
                onChange={handleChange}
                className="w-4 h-4 text-primary focus:ring-primary border-surface-300 dark:border-surface-600 rounded"
              />
              <label htmlFor="requirePassword" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                <div className="flex items-center gap-1.5">
                  <KeyIcon size={14} />
                  <span>Require password</span>
                </div>
              </label>
            </div>
            
            {shareSettings.requirePassword && (
              <input
                type="password"
                name="password"
                value={shareSettings.password}
                onChange={handleChange}
                placeholder="Enter a password"
                className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            
            {activeTab === 'email' && (
              <div>
                <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  <div className="flex items-center gap-1.5">
                    <MailIcon size={14} />
                    <span>Email Addresses</span>
                  </div>
                </label>
                <textarea
                  name="allowedEmails"
                  value={shareSettings.allowedEmails}
                  onChange={handleChange}
                  placeholder="Enter email addresses (separated by commas)"
                  rows={3}
                  className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            )}
          </div>
          
          {shareSettings.shareLink && activeTab === 'link' ? (
            <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-700 p-2 rounded-lg mb-4">
              <input
                type="text"
                value={shareSettings.shareLink}
                readOnly
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-surface-800 dark:text-surface-200"
              />
              <button
                onClick={handleCopyLink}
                className="p-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                aria-label="Copy link"
              >
                <CopyIcon size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 transition-colors"
            >
              {activeTab === 'link' ? (
                <>
                  <LinkIcon size={18} />
                  <span>Generate Share Link</span>
                </>
              ) : (
                <>
                  <SendIcon size={18} />
                  <span>Send Invitations</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;