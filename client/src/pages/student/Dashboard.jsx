import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { AlertCircle, CheckCircle, Clock, List, Shield, ArrowUpRight, Plus, Activity, Lock } from "lucide-react";
import { useComplaint } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { complaints } = useComplaint();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    
    // Filter complaints for current user
    const myComplaints = complaints;
    
    // Calculate Stats
    const stats = [
        { label: "TOTAL COMPLAINTS", value: myComplaints.length, icon: List, change: "+12%" },
        { label: "PENDING ISSUES", value: myComplaints.filter(c => c.status === 'Pending').length, icon: Clock, change: "Active" },
        { label: "RESOLVED TICKETS", value: myComplaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle, change: "98.5%" },
        { label: "ESCALATED LOGS", value: myComplaints.filter(c => c.status === 'Escalated').length, icon: AlertCircle, change: "Priority" },
    ];

    return (
        <div className="space-y-8 pb-10 font-sans">
            {/* ZeroShield Hero Console Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark-900 dark:text-white">
                                Student SOC Console
                            </h1>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#081520] text-[#00c885] border border-[#00c885]/30 uppercase flex items-center gap-1.5">
                                <Lock size={12} /> mTLS VERIFIED
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 font-medium">
                            Welcome back, {user?.name || "Student"}. Room telemetry &amp; service request pipeline active.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/student/raise-complaint')}
                            className="px-5 py-3 rounded-xl bg-[#00c885] hover:bg-[#00b074] text-white font-mono font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                            <Plus size={16} /> Submit Service Ticket
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat, index) => (
                    <Card key={index} className="!p-5 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                {stat.label}
                            </span>
                            <stat.icon size={15} className="text-[#00c885]" />
                        </div>
                        <div className="flex items-baseline justify-between mt-3">
                            <h3 className="text-2xl font-extrabold font-mono text-dark-900 dark:text-white">
                                {stat.value}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00c885]/10 text-[#00c885]">
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </motion.div>

            {/* Content Split: Left Recent Complaints + Right ZeroTrust Proxy Engine Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-extrabold text-dark-900 dark:text-white tracking-tight">
                            Recent Incident Telemetry
                        </h2>
                        <button 
                            onClick={() => navigate('/student/my-complaints')}
                            className="text-xs font-mono font-bold text-[#00c885] hover:underline flex items-center gap-1"
                        >
                            VIEW ALL TICKETS <ArrowUpRight size={13} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {myComplaints.length > 0 ? (
                            myComplaints.slice(0, 4).map((complaint) => (
                                <motion.div 
                                    key={complaint.id} 
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className="cursor-pointer"
                                >
                                    <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] hover:border-[#00c885]/40 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#081520] border border-[#182c3c] flex items-center justify-center text-lg text-[#00c885]">
                                                {complaint.category === 'Electrical' ? '⚡' : 
                                                 complaint.category === 'Plumbing' ? '🚰' : 
                                                 complaint.category === 'Carpentry' ? '🪑' : '🛠️'}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-dark-900 dark:text-white text-sm tracking-tight">
                                                    {complaint.category} Request
                                                </h4>
                                                <p className="text-[10px] font-mono text-dark-400 mt-0.5">
                                                    ID: #{complaint.id} &bull; {new Date(complaint.created_at || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                            complaint.status === 'Resolved' ? 'bg-emerald-500/10 text-[#00c885] border border-emerald-500/20' : 
                                            complaint.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                        }`}>
                                            {complaint.status}
                                        </span>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-[#0b1928] rounded-2xl border border-dark-200 dark:border-[#182c3c]">
                                <p className="text-dark-400 text-xs font-mono font-bold">No active service logs. System operational. 🌟</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Cyber Panel Banner */}
                <div>
                    <div className="bg-[#081520] border border-[#182c3c] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between h-full min-h-[340px]">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-[#00c885]/20 text-[#00c885] border border-[#00c885]/30 uppercase">
                                    ZERO TRUST ENFORCED
                                </span>
                                <Activity size={15} className="text-[#00c885]" />
                            </div>

                            <h3 className="text-xl font-extrabold text-white tracking-tight">
                                ZeroTrust Hostelfix Engine
                            </h3>
                            <p className="text-xs font-mono text-dark-300 mt-2 leading-relaxed">
                                Encrypted 256-bit student complaint routing to assigned warden node.
                            </p>

                            <div className="mt-6 pt-4 border-t border-[#182c3c] space-y-2 font-mono text-xs">
                                <div className="flex justify-between text-dark-300">
                                    <span>PROXY NODE:</span>
                                    <span className="text-[#00c885] font-bold">node-ap-south-1</span>
                                </div>
                                <div className="flex justify-between text-dark-300">
                                    <span>ENCRYPTION:</span>
                                    <span className="text-[#00c885] font-bold">mTLS 1.3</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/student/raise-complaint')}
                            className="w-full py-3 mt-6 rounded-xl bg-[#00c885] hover:bg-[#00b074] text-white font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                            Launch New Complaint →
                        </button>
                    </div>
                </div>
            </div>

            {/* Complaint Detail Modal */}
            {selectedComplaint && (
                <ComplaintDetailModal 
                    complaint={selectedComplaint} 
                    onClose={() => setSelectedComplaint(null)} 
                />
            )}
        </div>
    );
};

export default StudentDashboard;
