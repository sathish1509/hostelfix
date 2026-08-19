import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { AlertCircle, CheckCircle, Clock, List } from "lucide-react";
import { useComplaint } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";
import ProfileCard from "../../components/student/ProfileCard";

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { complaints } = useComplaint();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    
    // Filter complaints for current user
    const myComplaints = complaints;
    
    // Calculate Stats
    const stats = [
        { label: "Complaints", value: myComplaints.length, icon: List, color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
        { label: "Pending", value: myComplaints.filter(c => c.status === 'Pending').length, icon: Clock, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
        { label: "Resolved", value: myComplaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
        { label: "Escalated", value: myComplaints.filter(c => c.status === 'Escalated').length, icon: AlertCircle, color: "from-rose-500 to-red-600", shadow: "shadow-rose-500/20" },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Profile Section with Welcome Message */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex-1"
              >
                  <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-2">
                    Student Dashboard
                  </h1>
                  <p className="text-dark-500 dark:text-dark-400 font-medium">
                    Monitor your requests and get updates in real-time.
                  </p>
              </motion.div>
              
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:block"
              >
                  <ProfileCard user={user} />
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <Card key={index} hover className="stat-card group relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-full blur-2xl`} />
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-extrabold text-dark-900 dark:text-white mt-1 tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} ${stat.shadow} text-white shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">Recent Activity</h2>
                      <button 
                        onClick={() => navigate('/student/my-complaints')}
                        className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 group"
                      >
                        View all 
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {myComplaints.length > 0 ? (
                        myComplaints.slice(0, 3).map((complaint, index) => (
                          <motion.div 
                            key={complaint.id} 
                            onClick={() => setSelectedComplaint(complaint)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                          >
                              <Card hover className="flex items-center justify-between p-6 sm:p-6 !py-5 cursor-pointer !rounded-3xl border border-dark-100 dark:border-dark-800/50 group">
                                  <div className="flex items-center gap-5">
                                      <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300",
                                        complaint.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 
                                        complaint.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                      )}>
                                          {complaint.category === 'Electrical' ? '⚡' : 
                                           complaint.category === 'Plumbing' ? '🚰' : 
                                           complaint.category === 'Carpentry' ? '🪑' : '🛠️'}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-dark-900 dark:text-white text-lg tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {complaint.category}
                                          </h4>
                                          <div className="flex items-center gap-3 text-sm font-semibold text-dark-400 dark:text-dark-500 mt-0.5">
                                            <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-dark-300 dark:bg-dark-600" />
                                            <span className="capitalize">{complaint.category}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm",
                                    complaint.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                                    complaint.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-primary-500/10 text-primary-600 border border-primary-500/20'
                                  )}>
                                      {complaint.status}
                                  </div>
                              </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-dark-50 dark:bg-dark-900/20 rounded-[3rem] border-2 border-dashed border-dark-200 dark:border-dark-800/50">
                          <p className="text-dark-400 dark:text-dark-500 font-bold">No complaints found. Take a rest! 🌟</p>
                        </div>
                      )}
                    </div>
                </div>
                
                <div className="space-y-6">
                     <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">Need Help?</h2>
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                     >
                        <Card className="bg-gradient-to-br from-primary-600 via-indigo-700 to-primary-800 text-white !rounded-[2.5rem] p-10 overflow-hidden relative group shadow-2xl shadow-primary-500/30">
                            {/* Decorative elements */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 text-6xl opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">✨</div>
                            
                            <div className="relative z-10">
                              <h3 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">Fast Request Resolution</h3>
                              <p className="mb-10 text-primary-100 font-medium leading-relaxed italic">
                                "Facing an issue in your room? Our team is ready to help you fix it as soon as possible."
                              </p>
                              <button 
                                  onClick={() => navigate('/student/raise-complaint')}
                                  className="w-full py-4 bg-white text-primary-700 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-xs"
                              >
                                  Launch New Complaint
                              </button>
                            </div>
                        </Card>
                     </motion.div>
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
