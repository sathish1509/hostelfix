import { useState, useEffect } from "react";
import ComplaintDetailModal from "../../components/complaints/ComplaintDetailModal";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useComplaint } from "../../context/ComplaintContext";
import { Search, Filter, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonComplaintCard } from "../../components/ui/Skeleton";
import { cn } from "../../utils/cn";

const MyComplaints = () => {
    const { complaints } = useComplaint();
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    // Debounce
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const myComplaints = complaints.filter(c => c.studentId === 's1');

    const filtered = myComplaints.filter(c => {
        const matchesStatus = filter === "All" || c.status === filter;
        const matchesSearch =
            c.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            c.id.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusColors = {
        'Pending': 'warning',
        'In Progress': 'info',
        'Resolved': 'success',
        'Escalated': 'danger'
    };

    const filterOptions = ["All", "Pending", "In Progress", "Resolved", "Escalated"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Complaints</h1>

                <div className="flex gap-2 flex-wrap">
                    {/* Search with debounce + clear */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search ID or Title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-9 pr-8 w-48"
                        />
                        <AnimatePresence>
                            {search && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X size={14} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-field w-auto"
                    >
                        {filterOptions.map(o => <option key={o} value={o}>{o === "All" ? "All Status" : o}</option>)}
                    </select>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
                {filterOptions.map(o => (
                    <button
                        key={o}
                        onClick={() => setFilter(o)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm",
                            filter === o
                                ? "bg-primary-600 text-white shadow-primary-500/30"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                        )}
                    >
                        {o}
                        {o !== "All" && (
                            <span className="ml-1 opacity-70">
                                ({myComplaints.filter(c => c.status === o).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    [...Array(3)].map((_, i) => <SkeletonComplaintCard key={i} />)
                ) : (
                    <AnimatePresence>
                        {filtered.map((complaint, index) => (
                            <motion.div
                                key={complaint.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedComplaint(complaint)}
                            >
                                <Card hover className="group transition-all cursor-pointer">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <span className="font-mono text-xs text-gray-400">#{complaint.id}</span>
                                                <Badge variant={statusColors[complaint.status] || 'default'}>{complaint.status}</Badge>
                                                <span className="text-xs text-gray-400">• {complaint.date}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                                                {complaint.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                                {complaint.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs font-medium text-gray-500">Priority</p>
                                                <p className={`text-sm font-semibold ${
                                                    complaint.priority === 'High' ? 'text-red-500' :
                                                    complaint.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'
                                                }`}>
                                                    {complaint.priority}
                                                </p>
                                            </div>
                                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 group-hover:text-primary-600 transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!isLoading && filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Filter className="w-9 h-9 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            All clear!
                        </h3>
                        <p className="text-gray-500 text-sm">No complaints match your search or filters.</p>
                        {(search || filter !== "All") && (
                            <button
                                onClick={() => { setSearch(""); setFilter("All"); }}
                                className="mt-4 text-sm text-primary-600 hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {selectedComplaint && (
                <ComplaintDetailModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                />
            )}
        </div>
    );
};

export default MyComplaints;
