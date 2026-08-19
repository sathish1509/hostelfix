import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useComplaint } from "../../context/ComplaintContext";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, Activity, Lock, Cpu, Server, CheckCircle2, AlertTriangle, ArrowUpRight, Zap } from "lucide-react";

const AdminDashboard = () => {
    const { complaints } = useComplaint();
    const { theme } = useTheme();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [telemetryMode, setTelemetryMode] = useState("STATIC BASELINE DATASET");

    const escalations = complaints.filter(c => c.status === 'Escalated');

    // ZeroShield Sparkline Dummy Data
    const totalRequestsData = [
        { v: 120 }, { v: 140 }, { v: 130 }, { v: 170 }, { v: 160 }, { v: 190 }, { v: 210 }
    ];
    const allowedRequestsData = [
        { v: 110 }, { v: 135 }, { v: 125 }, { v: 165 }, { v: 155 }, { v: 185 }, { v: 205 }
    ];
    const blockedRequestsData = [
        { v: 45 }, { v: 40 }, { v: 38 }, { v: 42 }, { v: 35 }, { v: 30 }, { v: 28 }
    ];

    return (
        <div className="space-y-8 pb-20 font-sans">
            {/* 1. Hero ZeroShield Header Card */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark-900 dark:text-white">
                                ZeroShield Security Console
                            </h1>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#081520] text-[#00c885] border border-[#00c885]/30 uppercase flex items-center gap-1.5">
                                <ShieldCheck size={12} /> ZERO TRUST ENFORCED
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 font-medium">
                            Welcome back, SecOps Admin. Microservice API traffic is mTLS encrypted and verified across 8 proxy nodes.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <button
                                onClick={() => setTelemetryMode(telemetryMode === "STATIC BASELINE DATASET" ? "LIVE HOSTEL LOGS" : "STATIC BASELINE DATASET")}
                                className="px-3 py-1.5 rounded-full bg-dark-50 dark:bg-[#081520] border border-dark-200 dark:border-[#182c3c] text-[10px] font-mono font-bold text-dark-700 dark:text-dark-200 flex items-center gap-2 hover:border-[#00c885] transition-all cursor-pointer"
                            >
                                <span className="text-dark-400 dark:text-dark-400 uppercase">TELEMETRY MODE:</span>
                                <span className="text-[#00c885] font-extrabold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#00c885] animate-pulse" />
                                    {telemetryMode}
                                </span>
                            </button>

                            <button className="px-4 py-1.5 rounded-full bg-[#081520] hover:bg-[#0c1e2d] text-white border border-[#182c3c] text-xs font-mono font-bold uppercase flex items-center gap-2 transition-all cursor-pointer">
                                <Upload size={13} className="text-[#00c885]" />
                                Upload / Ingest Live Logs
                            </button>
                        </div>
                    </div>

                    {/* ZeroShield Metric Highlights */}
                    <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-dark-100 dark:border-[#182c3c] pt-4 lg:pt-0 lg:pl-8">
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-dark-900 dark:text-white font-mono tracking-tight">
                                1.42M
                            </p>
                            <p className="text-[10px] font-mono text-dark-400 uppercase font-bold tracking-wider mt-0.5 border-b-2 border-dark-900 dark:border-white pb-1">
                                Verified API Requests
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-dark-900 dark:text-white font-mono tracking-tight">
                                06
                            </p>
                            <p className="text-[10px] font-mono text-dark-400 uppercase font-bold tracking-wider mt-0.5 border-b-2 border-dark-900 dark:border-white pb-1">
                                Active Security Policies
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#00c885]">
                                97.0%
                            </p>
                            <p className="text-[10px] font-mono text-dark-400 uppercase font-bold tracking-wider mt-0.5 border-b-2 border-dark-900 dark:border-white pb-1">
                                Threat Defense Rate
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2. Main Grid: Left Analytics + Right ZeroTrust Proxy Engine Banner Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Stat Summary Grid (6 cards like ZeroShield) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        
                        {/* Card 1: Total Requests */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    TOTAL REQUESTS
                                </span>
                                <Activity size={14} className="text-dark-400" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-xl font-extrabold font-mono text-dark-900 dark:text-white">
                                    1,420,500
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-[#00c885]">
                                    +12.4%
                                </span>
                            </div>
                            <div className="h-10 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={totalRequestsData}>
                                        <Area type="monotone" dataKey="v" stroke="#00c885" fill="#00c885" fillOpacity={0.15} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Card 2: Allowed Requests */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    ALLOWED REQUESTS
                                </span>
                                <CheckCircle2 size={14} className="text-[#00c885]" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-xl font-extrabold font-mono text-dark-900 dark:text-white">
                                    1,378,000
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-[#00c885]">
                                    +14.1%
                                </span>
                            </div>
                            <div className="h-10 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={allowedRequestsData}>
                                        <Area type="monotone" dataKey="v" stroke="#00c885" fill="#00c885" fillOpacity={0.2} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Card 3: Blocked Requests */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    BLOCKED REQUESTS
                                </span>
                                <AlertTriangle size={14} className="text-rose-500" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-xl font-extrabold font-mono text-dark-900 dark:text-white">
                                    42,500
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-500">
                                    -4.2%
                                </span>
                            </div>
                            <div className="h-10 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={blockedRequestsData}>
                                        <Area type="monotone" dataKey="v" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Card 4: Active Services */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    ACTIVE SERVICES
                                </span>
                                <Server size={14} className="text-dark-400" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-xl font-extrabold font-mono text-dark-900 dark:text-white">
                                    8 / 8
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-dark-100 dark:bg-[#182c3c] text-dark-400">
                                    100% online
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-dark-100 dark:bg-[#182c3c] rounded-full overflow-hidden mt-4">
                                <div className="w-full h-full bg-[#00c885]" />
                            </div>
                        </Card>

                        {/* Card 5: Threat Level */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    THREAT LEVEL
                                </span>
                                <Zap size={14} className="text-amber-500" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-lg font-extrabold text-dark-900 dark:text-white tracking-tight">
                                    Elevated
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500">
                                    Normal SOC
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-dark-100 dark:bg-[#182c3c] rounded-full overflow-hidden mt-4">
                                <div className="w-[70%] h-full bg-amber-500" />
                            </div>
                        </Card>

                        {/* Card 6: Avg Proxy Latency */}
                        <Card className="!p-4 bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                                    AVG PROXY LATENCY
                                </span>
                                <Cpu size={14} className="text-dark-400" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <h3 className="text-xl font-extrabold font-mono text-dark-900 dark:text-white">
                                    8.4ms
                                </h3>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-dark-100 dark:bg-[#182c3c] text-dark-400">
                                    target &lt;15ms
                                </span>
                            </div>
                            <div className="h-10 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={totalRequestsData}>
                                        <Area type="monotone" dataKey="v" stroke="#00c885" fill="#00c885" fillOpacity={0.1} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: ZeroTrust Proxy Engine Featured Dark Card */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#081520] border border-[#182c3c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[380px]"
                    >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#00c885]/20 border border-[#00c885]/40 flex items-center justify-center text-[#00c885]">
                                    <Lock size={15} />
                                </div>
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-[#00c885]/20 text-[#00c885] border border-[#00c885]/30 uppercase">
                                    MESH ONLINE
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-dark-400 font-bold">
                                ID: ZS-MESH-01
                            </span>
                        </div>

                        {/* Card Content */}
                        <div className="my-4">
                            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#00c885] uppercase mb-1">
                                <span>📌 STATIC BASELINE</span>
                                <span>&bull; Sub-10ms Verified</span>
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                                ZeroTrust Proxy Engine
                            </h2>
                            <p className="text-xs font-mono text-dark-300 mt-1 flex items-center gap-1.5">
                                <Lock size={12} className="text-[#00c885]" />
                                mTLS 1.3 &amp; RS256 Active Protection
                            </p>

                            {/* Meters Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#182c3c]">
                                <div>
                                    <p className="text-[9px] font-mono font-bold uppercase text-dark-400">PROXY LATENCY</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-xl font-mono font-extrabold text-white">8.4 ms</span>
                                        <span className="text-[9px] font-mono text-[#00c885] font-bold">&lt;35ms OK</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-mono font-bold uppercase text-dark-400">PROXY SHARDS</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-xl font-mono font-extrabold text-white">8 / 8 Online</span>
                                        <span className="text-[9px] font-mono text-[#00c885] font-bold">100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Node Status Indicator Lights */}
                            <div className="mt-4 pt-3 border-t border-[#182c3c]/60">
                                <div className="flex items-center justify-between text-[9px] font-mono font-bold text-dark-400 uppercase mb-1.5">
                                    <span>MESH NODE SHARDS:</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="flex-1 h-2 rounded-full bg-[#00c885] shadow-sm shadow-emerald-500/50" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Button & Footer */}
                        <div>
                            <button className="w-full py-3 px-4 rounded-xl bg-[#00c885] hover:bg-[#00b074] text-white font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
                                🧪 Test Proxy Interception <ArrowUpRight size={14} />
                            </button>
                            <p className="text-center text-[9px] font-mono text-dark-500 mt-2 font-bold">
                                mTLS 1.3 + JWT
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Incidents & Audit Table Section */}
            <Card className="!p-0 overflow-hidden bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c]">
                <div className="px-6 py-5 border-b border-dark-100 dark:border-[#182c3c] flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-dark-900 dark:text-white tracking-tight">
                            Recent Security Incidents &amp; Complaints
                        </h3>
                        <p className="text-xs text-dark-400 font-mono mt-0.5">
                            Real-time zero-trust packet inspection logs
                        </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        {complaints.length} INCIDENTS
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="table-header bg-dark-50 dark:bg-[#081520]">
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400">IDENTIFIER</th>
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400">SUBJECT MATTER</th>
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400">LOCATION</th>
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400">TIMESTAMP</th>
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400">STATUS</th>
                                <th className="px-6 py-4 text-[10px] font-mono uppercase font-bold text-dark-400 text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100 dark:divide-[#182c3c]">
                            {(complaints.length > 0 ? complaints : [
                                { id: "C-1005", title: "Expired JWT Token Replay", block: "Payment-Service", created_at: new Date().toISOString(), status: "Escalated" },
                                { id: "C-[#1006]", title: "SSL Cipher Mismatch on Node 3", block: "Auth-Proxy", created_at: new Date().toISOString(), status: "Pending" }
                            ]).map((c) => (
                                <tr key={c.id} className="table-row-hover hover:bg-dark-50/50 dark:hover:bg-[#081520]/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono font-bold text-[#00c885]">#{c.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-sm text-dark-900 dark:text-white tracking-tight">{c.title || c.category}</div>
                                        <div className="text-[10px] font-mono text-dark-400 mt-0.5">mTLS Gateway Node: node-proxy-ap-south-1</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-dark-100 dark:bg-[#182c3c] text-[10px] font-mono font-bold text-dark-700 dark:text-dark-300 rounded-md">
                                            Block {c.block || 'A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-dark-400">
                                        {new Date(c.created_at || Date.now()).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                            c.status === 'Resolved' ? 'bg-emerald-500/10 text-[#00c885] border border-emerald-500/20' :
                                            c.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedComplaint(c)}
                                            className="px-3.5 py-1.5 bg-dark-100 dark:bg-[#182c3c] hover:bg-[#00c885] hover:text-white text-dark-700 dark:text-dark-200 text-xs font-mono font-bold rounded-xl transition-all"
                                        >
                                            INSPECT
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
