import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Search, Shield, ShieldOff, Trash2, UsersIcon, UserCog } from "lucide-react";
import { toast } from "react-hot-toast";

const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const UserTable = ({ data, title, icon: Icon, toggleStatus, deleteUser, isStaff }) => (
    <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                <Icon size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <Badge variant="secondary" className="ml-1">{data.length}</Badge>
        </div>
        <Card noPadding className="overflow-hidden border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="table-header">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        {isStaff && <th className="px-6 py-4">Attendance</th>}
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((user) => (
                        <tr key={user.id} className="table-row-hover transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-slate-500 font-normal">{user.email}</p>
                                </div>
                            </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge>
                                </td>
                                {isStaff && (
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${user.isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                <span className={`text-xs font-semibold ${user.isOnDuty ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                                    {user.isOnDuty ? 'On Duty' : 'Off Duty'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-0.5">Last: {user.lastActive || "Never"}</span>
                                        </div>
                                    </td>
                                )}
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <button 
                                        onClick={() => toggleStatus(user.id)}
                                        className={`p-2 rounded-xl transition-all duration-200 ${
                                            user.status === 'Active' 
                                            ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10' 
                                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                        }`}
                                        title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                                    >
                                        {user.status === 'Active' ? <ShieldOff size={18} /> : <Shield size={18} />}
                                    </button>
                                    <button 
                                        onClick={() => deleteUser(user.id, user.name)}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={isStaff ? 4 : 3} className="px-6 py-8 text-center text-slate-500 italic">
                                No {title.toLowerCase()} found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Card>
    </motion.div>
);

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { default: api } = await import('../../utils/api');
            const res = await api.get('/users');
            setUsers(res.data.map(u => ({
                ...u, 
                status: 'Active', 
                isOnDuty: u.role === 'warden' ? true : undefined,
                lastActive: 'Just now'
            })));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const filtered = users.filter(u => 
        u?.name?.toLowerCase().includes(search.toLowerCase()) || 
        u?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const wardens = filtered.filter(u => u?.role === 'warden');
    const students = filtered.filter(u => u?.role === 'student');

    const toggleStatus = (id) => {
        toast.error("Not implemented in backend requirements");
    };

    const deleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
        try {
            const { default: api } = await import('../../utils/api');
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        }
    };

    return (
        <motion.div 
            className="space-y-10"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
                    <p className="text-sm text-slate-500">Manage hostel staff and student access</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9 pr-4 w-72"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <UserTable data={wardens} title="Wardens" icon={UserCog} toggleStatus={toggleStatus} deleteUser={deleteUser} isStaff />
                <UserTable data={students} title="Students" icon={UsersIcon} toggleStatus={toggleStatus} deleteUser={deleteUser} />
            </div>
        </motion.div>
    );
};

export default Users;
