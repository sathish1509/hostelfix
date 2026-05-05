import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { useComplaint } from "../../context/ComplaintContext";
import { useTheme } from "../../context/ThemeContext";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonCard } from "../../components/ui/Skeleton";

const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const WardenAnalytics = () => {
    const { complaints } = useComplaint();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const blockComplaints = complaints.filter(c => c.block === 'A');

    // KPI data
    const kpis = [
        {
            label: "Total Complaints",
            value: blockComplaints.length,
            icon: ClipboardList,
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
        },
        {
            label: "Resolved",
            value: blockComplaints.filter(c => c.status === 'Resolved').length,
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Pending",
            value: blockComplaints.filter(c => c.status === 'Pending').length,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            text: "text-amber-600 dark:text-amber-400",
        },
        {
            label: "Escalated",
            value: blockComplaints.filter(c => c.status === 'Escalated').length,
            icon: AlertTriangle,
            color: "from-red-500 to-rose-600",
            bg: "bg-red-50 dark:bg-red-900/20",
            text: "text-red-600 dark:text-red-400",
        },
    ];

    const categoryData = [
        { name: 'Electrical', value: 12 },
        { name: 'Plumbing', value: 8 },
        { name: 'Cleaning', value: 5 },
        { name: 'Wifi', value: 15 },
    ];

    const timeData = [
        { name: 'Week 1', resolved: 10, pending: 5 },
        { name: 'Week 2', resolved: 15, pending: 3 },
        { name: 'Week 3', resolved: 8, pending: 8 },
        { name: 'Week 4', resolved: 20, pending: 2 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    // Theme-aware chart colors - increased contrast for visibility
    const axisColor = theme === 'dark' ? '#cbd5e1' : '#64748b';
    const gridColor = theme === 'dark' ? '#374151' : '#f1f5f9';
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'}`,
        borderRadius: '12px',
        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
        boxShadow: theme === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Block A Analytics</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span>Live data</span>
                </div>
            </div>

            {/* KPI Row */}
            <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {isLoading
                    ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                    : kpis.map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            variants={itemVariants}
                        >
                            <Card className="relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-[0.03] dark:opacity-5 transition-opacity group-hover:opacity-[0.06]`} />
                                <div className="relative">
                                    <div className={`inline-flex p-2.5 rounded-xl ${kpi.bg} border border-white dark:border-transparent mb-3 shadow-sm`}>
                                        <kpi.icon className={`w-5 h-5 ${kpi.text}`} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${kpi.text} drop-shadow-sm`}>{kpi.value}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                }
            </motion.div>

            {/* Charts */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={itemVariants}>
                    <Card>
                        <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-gray-100">Complaints by Category</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%" key={theme}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        innerRadius={40}
                                        dataKey="value"
                                        paddingAngle={3}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend
                                        formatter={(value) => (
                                            <span className="text-xs font-medium" style={{ color: axisColor }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-gray-100">Resolution Performance</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%" key={theme}>
                                <BarChart data={timeData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
                                    <Legend formatter={(value) => <span className="text-xs font-medium" style={{ color: axisColor }}>{value}</span>} />
                                    <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default WardenAnalytics;
