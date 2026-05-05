import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useComplaint } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, XCircle, Clock, MessageSquare, AlertTriangle, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const Supervision = () => {
    const { complaints, updateStatus, escalateComplaint } = useComplaint();
    const { user } = useAuth();
    const [filter, setFilter] = useState("Pending");

    // Filter mainly for pending/approved to take action
    const blockComplaints = complaints.filter(c => filter === "All" || c.status === filter);

    const handleAction = (id, action) => {
        if (action === 'Approve') {
            updateStatus(id, 'Approved', 'Approved by Warden. Maintenance assigned.');
            toast.success("Complaint approved!");
        } else if (action === 'Reject') {
            updateStatus(id, 'Rejected', 'Rejected by Warden. Reason: Invalid complaint.');
            toast.error("Complaint rejected.");
        } else if (action === 'Resolve') {
            updateStatus(id, 'Resolved', 'Issue resolved verified by Warden.');
            toast.success("Marked as resolved!");
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-2">
                      Supervision Panel
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 font-medium italic">
                      Managing block <span className="text-primary-600 font-bold uppercase">{user?.block || 'Assigned'}</span> requests
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex bg-dark-100/50 dark:bg-dark-900/50 p-1.5 rounded-2xl border border-dark-200/50 dark:border-dark-800/50 shadow-inner"
                >
                    {['Pending', 'Approved', 'In Progress', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest ${
                                filter === status 
                                ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-premium scale-105 z-10' 
                                : 'text-dark-400 dark:text-dark-500 hover:text-dark-600 dark:hover:text-dark-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </motion.div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {blockComplaints.map((complaint, index) => (
                        <motion.div
                            key={complaint.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card premium className="!p-0 border border-dark-100 dark:border-dark-800/50 overflow-hidden group">
                                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-dark-100 dark:divide-dark-800/50">
                                    {/* Left side: Content */}
                                    <div className="flex-1 p-6 lg:p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-dark-50 dark:bg-dark-950 text-[10px] font-mono font-bold text-dark-400 dark:text-dark-500 rounded-lg border border-dark-200/50 dark:border-dark-800/50">
                                              #{complaint.id}
                                            </span>
                                            <div className={cn(
                                              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full",
                                              complaint.priority === 'High' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 
                                              complaint.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 
                                              'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                            )}>
                                                {complaint.priority}
                                            </div>
                                            <span className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-tighter">
                                              Block {complaint.block || user?.block || 'Assigned'} / Room {complaint.room_number}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                          {complaint.category} - {complaint.urgency}
                                        </h3>
                                        <p className="text-dark-500 dark:text-dark-400 font-medium leading-relaxed max-w-2xl">
                                          {complaint.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-6 mt-8">
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">
                                                <div className="p-1.5 bg-dark-50 dark:bg-dark-800 rounded-lg"><Clock size={16} /></div>
                                                <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">
                                                <div className="p-1.5 bg-dark-50 dark:bg-dark-800 rounded-lg"><User size={16} /></div>
                                                <span className="text-dark-600 dark:text-dark-300">{complaint.student_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side: Actions */}
                                    <div className="lg:w-72 bg-dark-50/30 dark:bg-dark-900/20 p-6 lg:p-8 flex flex-col justify-center gap-3">
                                        {complaint.status === 'Pending' && (
                                            <>
                                                <Button size="md" onClick={() => handleAction(complaint.id, 'Approve')} className="!rounded-2xl w-full">
                                                    <CheckCircle size={18} className="mr-2" /> Approve
                                                </Button>
                                                <Button size="md" variant="secondary" onClick={() => handleAction(complaint.id, 'Reject')} className="!rounded-2xl w-full border-rose-100 dark:border-rose-900/30 text-rose-600">
                                                    <XCircle size={18} className="mr-2" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {complaint.status === 'Approved' && (
                                             <Button size="md" onClick={() => updateStatus(complaint.id, 'In Progress')} className="!rounded-2xl w-full">
                                                <Clock size={18} className="mr-2" /> Start Work
                                            </Button>
                                        )}
                                        {(complaint.status === 'In Progress' || complaint.status === 'Approved') && (
                                            <Button size="md" onClick={() => handleAction(complaint.id, 'Resolve')} className="!rounded-2xl w-full">
                                                <CheckCircle size={18} className="mr-2" /> Mark Fixed
                                            </Button>
                                        )}
                                        {complaint.status !== 'Resolved' && complaint.status !== 'Rejected' && (
                                             <button 
                                                onClick={() => escalateComplaint(complaint.id)} 
                                                className="mt-2 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] hover:underline flex items-center justify-center gap-2 transition-all opacity-60 hover:opacity-100"
                                              >
                                                <AlertTriangle size={14} className="animate-pulse" /> Escalate to Admin
                                            </button>
                                        )}
                                        {complaint.status === 'Resolved' && (
                                          <div className="flex flex-col items-center justify-center h-full text-emerald-500 opacity-60">
                                            <CheckCircle size={40} className="mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
                                          </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                 {blockComplaints.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-dark-50 dark:bg-dark-900/20 rounded-[3rem] border-2 border-dashed border-dark-100 dark:border-dark-800/50"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-dark-100 dark:bg-dark-800 mb-6 font-bold text-3xl">✨</div>
                        <p className="text-dark-500 dark:text-dark-400 font-bold text-xl tracking-tight">
                          All clear! No complaints matching your filter.
                        </p>
                        <button 
                          onClick={() => setFilter('All')} 
                          className="mt-4 text-primary-600 font-bold hover:underline"
                        >
                          View all tasks
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Supervision;
