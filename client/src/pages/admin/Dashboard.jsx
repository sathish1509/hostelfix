import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useComplaint } from "../../context/ComplaintContext";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { TrendingUp, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const AdminDashboard = () => {
    const { complaints } = useComplaint();
    const { theme } = useTheme();
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const escalations = complaints.filter(c => c.status === 'Escalated');

    const stats = [
      { label: 'Total Users', value: '1,280', icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
      { label: 'Live Issues', value: complaints.filter(c => c.status !== 'Resolved').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-500/10' },
      { label: 'Resolution Rate', value: '94%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
      { label: 'Escalations', value: escalations.length, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    ];

    const data = [
        { name: 'Jan', complaints: 40 },
        { name: 'Feb', complaints: 30 },
        { name: 'Mar', complaints: 20 },
        { name: 'Apr', complaints: 27 },
        { name: 'May', complaints: 18 },
        { name: 'Jun', complaints: 23 },
    ];

    const pieData = [
        { name: 'Pending', value: complaints.filter(c => c.status === 'Pending').length || 0 },
        { name: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length || 0 },
        { name: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length || 0 },
    ];

    const COLORS = ['#FBBF24', '#3B82F6', '#10B981', '#EF4444'];

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-2">
                      Admin Intelligence
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 font-medium italic">
                      Real-time analytics and platform governance
                    </p>
                </motion.div>
                
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(idx => (
                    <div key={idx} className="w-10 h-10 rounded-full border-4 border-white dark:border-dark-900 bg-dark-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} alt="Admin" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white dark:border-dark-900 bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    +12
                  </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card premium className="!p-6 flex items-center gap-5 hover:scale-105 transition-transform duration-500 cursor-pointer group">
                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-[1.25rem] group-hover:rotate-6 transition-transform duration-500`}>
                      <stat.icon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-extrabold text-dark-900 dark:text-white">{stat.value}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card premium className="lg:col-span-2">
                    <h3 className="text-lg font-extrabold text-dark-900 dark:text-white mb-8 tracking-tight">Monthly Incident Velocity</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%" key={theme}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                <XAxis 
                                  dataKey="name" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                      borderRadius: '1.25rem', 
                                      border: 'none', 
                                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                                      padding: '12px 16px'
                                    }}
                                    cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                                />
                                <Bar dataKey="complaints" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card premium>
                    <h3 className="text-lg font-extrabold text-dark-900 dark:text-white mb-8 tracking-tight">Resolution Phase</h3>
                    <div className="h-64 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%" key={theme}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-extrabold text-dark-900 dark:text-white">
                            {pieData.reduce((acc, curr) => acc + curr.value, 0)}
                          </span>
                          <span className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest mt-1">Total Items</span>
                        </div>
                    </div>
                    <div className="space-y-3 mt-8">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-900/50 rounded-xl border border-dark-100 dark:border-dark-800/50">
                                <div className="flex items-center gap-3 font-bold text-xs text-dark-900 dark:text-white uppercase tracking-widest">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                  {entry.name}
                                </div>
                                <span className="font-mono font-bold text-dark-400">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card premium className="!p-0 overflow-hidden">
                <div className="px-8 py-6 border-bottom border-dark-100 dark:border-dark-800/50 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-dark-900 dark:text-white tracking-tight">Critical Escalations</h3>
                  <button className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline">View History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead>
                            <tr className="table-header">
                                <th className="px-8 !py-5">IDENTIFIER</th>
                                <th className="px-8 !py-5">SUBJECT MATTER</th>
                                <th className="px-8 !py-5">LOCATION</th>
                                <th className="px-8 !py-5">DATE REPORTED</th>
                                <th className="px-8 !py-5">URGENCY</th>
                                <th className="px-8 !py-5 text-right">OPERATIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100 dark:divide-dark-800/50">
                            {(escalations.length > 0 ? escalations : [{
                                id: "C-1005",
                                title: "Major WiFi Infrastructure Failure",
                                block: "B",
                                createdAt: "26 Oct 2023",
                                status: "Escalated",
                                priority: "High"
                            }]).map((c) => (
                                <tr key={c.id} className="table-row-hover group transition-colors">
                                    <td className="px-8 py-6 text-[10px] font-mono font-bold text-dark-400">#{c.id}</td>
                                    <td className="px-8 py-6">
                                      <div className="font-bold text-dark-900 dark:text-white tracking-tight group-hover:text-primary-600 transition-colors">{c.title}</div>
                                      <div className="text-[10px] font-medium text-dark-400 uppercase tracking-widest mt-0.5">Systems Infrastructure</div>
                                    </td>
                                    <td className="px-8 py-6">
                                      <span className="px-3 py-1 bg-dark-100 dark:bg-dark-800 text-[10px] font-bold text-dark-600 dark:text-dark-400 rounded-lg">Block {c.block}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-semibold text-dark-500 dark:text-dark-400">{c.createdAt || "26 Oct 2023"}</td>
                                    <td className="px-8 py-6">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">{c.status}</span>
                                      </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedComplaint(c)}
                                            className="px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-primary-600 hover:text-white text-dark-700 dark:text-dark-200 text-xs font-bold rounded-xl transition-all uppercase tracking-widest"
                                        >
                                            Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedComplaint && (
                <ComplaintDetailModal 
                    complaint={selectedComplaint} 
                    onClose={() => setSelectedComplaint(null)} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;
