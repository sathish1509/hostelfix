import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/rooms');
                setRooms(res.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load rooms");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading rooms...</div>;
    }

    return (
        <div className="space-y-8 pb-12">
            <header>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-2">
                      Rooms Management
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 font-medium italic">
                      Manage hostel rooms and occupancy
                    </p>
                </motion.div>
            </header>

            <Card premium className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="table-header border-b border-dark-100 dark:border-dark-800/50 bg-dark-50 dark:bg-dark-900/50">
                                <th className="px-8 py-5 text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-widest">Room Number</th>
                                <th className="px-8 py-5 text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-widest">Student</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100 dark:divide-dark-800/50">
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-10 text-center text-dark-500">No rooms found.</td>
                                </tr>
                            ) : rooms.map((room) => (
                                <tr key={room.id} className="table-row-hover group transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-dark-900 dark:text-white">{room.room_number}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={room.occupancy_status === 'Occupied' ? 'error' : 'success'}>
                                            {room.occupancy_status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-dark-500 dark:text-dark-400">
                                        {room.student_name || "Unassigned"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Rooms;
