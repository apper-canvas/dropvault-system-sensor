import { useState } from 'react';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

const History = () => {
  // State for filtering activities
  const [filter, setFilter] = useState('all'); // 'all', 'download', 'upload'
  
  // Placeholder data for activities
  const activities = [
    {
      id: 1,
      type: 'upload',
      fileName: 'Project_Presentation.pptx',
      fileSize: '2.4 MB',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'success'
    },
    {
      id: 2,
      type: 'download',
      fileName: 'Financial_Report_2023.pdf',
      fileSize: '1.8 MB',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'success'
    },
    {
      id: 3,
      type: 'upload',
      fileName: 'Profile_Picture.jpg',
      fileSize: '0.5 MB',
      timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      status: 'success'
    },
    {
      id: 4,
      type: 'download',
      fileName: 'Meeting_Notes.docx',
      fileSize: '0.3 MB',
      timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      status: 'success'
    },
    {
      id: 5,
      type: 'upload',
      fileName: 'Video_Presentation.mp4',
      fileSize: '15.2 MB',
      timestamp: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
      status: 'failed'
    }
  ];
  
  // Filter activities based on selected filter
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });
  
  // Icons for the activity types
  const UploadIcon = getIcon('Upload');
  const DownloadIcon = getIcon('Download');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Activity History</h1>
        <p className="text-surface-600 dark:text-surface-400">
          View your recent download and upload activity
        </p>
      </div>
      
      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All Activities
        </button>
        <button
          onClick={() => setFilter('download')}
          className={`btn ${filter === 'download' ? 'btn-primary' : 'btn-outline'}`}
        >
          Downloads
        </button>
        <button
          onClick={() => setFilter('upload')}
          className={`btn ${filter === 'upload' ? 'btn-primary' : 'btn-outline'}`}
        >
          Uploads
        </button>
      </div>
      
      {/* Activity list */}
      <div className="space-y-4">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="card p-4 flex items-center">
            <div className={`p-3 rounded-full ${activity.type === 'upload' ? 'bg-primary-light/20 text-primary' : 'bg-secondary-light/20 text-secondary'}`}>
              {activity.type === 'upload' ? <UploadIcon size={20} /> : <DownloadIcon size={20} />}
            </div>
            <div className="ml-4 flex-grow">
              <div className="font-medium">{activity.fileName} {activity.status === 'failed' && <AlertCircleIcon className="inline-block text-red-500 ml-1" size={16} />}</div>
              <div className="text-sm text-surface-500 dark:text-surface-400">{activity.fileSize} • {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</div>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-surface-200 dark:bg-surface-700">{activity.type === 'upload' ? 'Uploaded' : 'Downloaded'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;