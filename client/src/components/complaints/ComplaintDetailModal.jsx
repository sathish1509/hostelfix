import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, CheckCircle2, AlertCircle, FileText, Calendar } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useComplaint } from "../../context/ComplaintContext";

const ComplaintDetailModal = ({ complaint, onClose }) => {
  const { user } = useAuth();
  const { updateStatus } = useComplaint();

  if (!complaint) return null;

  const handleStatusChange = async (newStatus) => {
    await updateStatus(complaint.id, newStatus);
    onClose();
  };

  const statusColors = {
    'Pending': 'warning',
    'In Progress': 'info',
    'Resolved': 'success',
    'Escalated': 'danger'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50/50 dark:bg-gray-800/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  #{complaint.id}
                </span>
                <Badge variant={statusColors[complaint.status] || 'default'}>
                  {complaint.status}
                </Badge>
                <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                    complaint.priority === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 
                    complaint.priority === 'Medium' ? 'text-orange-600 border-orange-200 bg-orange-50' : 
                    'text-green-600 border-green-200 bg-green-50'
                }`}>
                    {complaint.priority} Priority
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pr-8">
                {complaint.title}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors absolute top-4 right-4"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
             {/* Info Grid */}
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText size={16} />
                    <span>Category: <span className="font-semibold text-gray-900 dark:text-gray-200">{complaint.category}</span></span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>Date: <span className="font-semibold text-gray-900 dark:text-gray-200">{complaint.date}</span></span>
                </div>
             </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                {complaint.description}
              </p>
            </div>

            {/* Attachment */}
            {(complaint.attachment || complaint.image) && (
                <div className="space-y-2">
                     <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Attachment</h3>
                     {complaint.attachmentType === 'video' ? (
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-black">
                             <video 
                                src={complaint.attachment} 
                                controls 
                                className="w-full max-h-[400px] mx-auto"
                            />
                        </div>
                     ) : (
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <img 
                                src={complaint.attachment || complaint.image} 
                                alt="Complaint Attachment" 
                                className="w-full max-h-[400px] object-contain bg-gray-50 dark:bg-gray-800" 
                            />
                        </div>
                     )}
                </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Status Timeline</h3>
              <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6 pb-2">
                {complaint.timeline?.map((event, index) => (
                  <div key={index} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                        index === complaint.timeline.length - 1 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{event.status}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{event.note}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-mono mt-1 sm:mt-0">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
            <div className="flex gap-2">
              {user?.role !== 'student' && complaint.status === 'Pending' && (
                <Button onClick={() => handleStatusChange('In Progress')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Mark In Progress
                </Button>
              )}
              {user?.role !== 'student' && complaint.status === 'In Progress' && (
                <Button onClick={() => handleStatusChange('Resolved')} className="bg-green-600 hover:bg-green-700 text-white">
                  Resolve Issue
                </Button>
              )}
              {user?.role !== 'student' && complaint.status !== 'Resolved' && complaint.status !== 'Escalated' && (
                <Button onClick={() => handleStatusChange('Escalated')} className="bg-red-600 hover:bg-red-700 text-white">
                  Escalate
                </Button>
              )}
            </div>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComplaintDetailModal;
