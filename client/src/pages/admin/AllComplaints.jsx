import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useComplaint } from "../../context/ComplaintContext";
import { Search, Trash2, Eye, X, ClipboardList } from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { SkeletonRow } from "../../components/ui/Skeleton";

const AllComplaints = () => {
    const { complaints } = useComplaint();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const filtered = complaints.filter(c => {
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        
        const categoryMatch = c.category ? c.category.toLowerCase().includes(debouncedSearch.toLowerCase()) : false;
        const studentMatch = c.student_name ? c.student_name.toLowerCase().includes(debouncedSearch.toLowerCase()) : false;
        const blockMatch = c.block ? c.block.toLowerCase().includes(debouncedSearch.toLowerCase()) : false;
        
        const matchesSearch = categoryMatch || studentMatch || blockMatch;
        return matchesStatus && matchesSearch;
    });

    const handleDelete = (id) => {
        toast.success(`Complaint ${id} deleted`, { icon: "🗑️" });
    };

    const statusBadge = (status) => {
        if (status === "Resolved") return "success";
        if (status === "Escalated") return "danger";
        if (status === "Pending") return "warning";
        return "info";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Complaints</h1>

                <div className="flex gap-2 flex-wrap">
                    {/* Search with debounce + clear */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            placeholder="Search complaints..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 w-52 transition-all"
                        />
                        <AnimatePresence>
                            {search && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X size={14} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Escalated">Escalated</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <Card noPadding className="overflow-hidden hidden md:block">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="table-header">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Block / Room</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                        ) : (
                            filtered.map((complaint) => (
                                <tr
                                    key={complaint.id}
                                    className="table-row-hover transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono text-xs">{complaint.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{complaint.category}</td>
                                    <td className="px-6 py-4">{complaint.block || 'A'}-{complaint.room_number}</td>
                                    <td className="px-6 py-4">{complaint.student_name}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={statusBadge(complaint.status)}>{complaint.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(complaint.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <ClipboardList className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No complaints found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
                    </div>
                )}
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="card p-4 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                        </div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p>No complaints found</p>
                    </div>
                ) : (
                    filtered.map((complaint) => (
                        <motion.div
                            key={complaint.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="font-mono text-xs text-gray-400">{complaint.id}</span>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{complaint.category}</h3>
                                </div>
                                <Badge variant={statusBadge(complaint.status)}>{complaint.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                <p>Block {complaint.block || 'A'}, Room {complaint.room_number}</p>
                                <p>{complaint.student_name}</p>
                            </div>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                    <Eye size={15} /> View
                                </button>
                                <button
                                    onClick={() => handleDelete(complaint.id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllComplaints;
