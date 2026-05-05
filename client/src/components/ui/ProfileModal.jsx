import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Phone, MapPin, Building, Mail,
  Shield, Hash, CheckCircle
} from "lucide-react";

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const roleColors = {
    student: "from-blue-500 to-indigo-600",
    warden: "from-emerald-500 to-teal-600",
    admin: "from-purple-500 to-pink-600",
  };
  const gradientClass = roleColors[user.role] || "from-primary-500 to-primary-700";

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const idLabel = user.role === "student" ? "Student ID" : user.role === "warden" ? "Warden ID" : "Admin ID";

  const fields = [
    { icon: Mail, label: "Email", value: user.email, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: Hash, label: idLabel, value: user.id, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { icon: Building, label: "Block", value: user.block ? `Block ${user.block}` : "—", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { icon: MapPin, label: "Room", value: user.room ? `Room ${user.room}` : "—", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { icon: Phone, label: "Mobile", value: user.phone || "Not Added", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { icon: User, label: "Parent Contact", value: user.parentPhone || "Not Added", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { icon: CheckCircle, label: "Status", value: user.currentStatus || "In Hostel", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { icon: Shield, label: "Role", value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1), color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ].filter(f => {
    // Only show relevant fields per role
    if (user.role === "admin") return ["Email", idLabel, "Role"].includes(f.label);
    if (user.role === "warden") return ["Email", idLabel, "Block", "Role"].includes(f.label);
    return true; // show all for student
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className={`bg-gradient-to-br ${gradientClass} p-6 pb-16 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X size={18} />
            </button>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
              {user.role} Profile
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">{user.name}</h2>
          </div>

          {/* Avatar overlapping the banner */}
          <div className="relative px-6 -mt-10 mb-4 flex items-end gap-4">
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white dark:border-gray-900`}>
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" title="Active" />
            </div>
            <div className="pb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradientClass} text-white shadow-md`}>
                <CheckCircle size={12} />
                Active
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div
                key={field.label}
                className={`p-3 rounded-2xl ${field.bg} border border-gray-100 dark:border-gray-800 flex items-start gap-3 ${
                  field.label === "Email" ? "col-span-2" : ""
                }`}
              >
                <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex-shrink-0`}>
                  <field.icon className={`w-4 h-4 ${field.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mt-0.5">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-2xl bg-gradient-to-r ${gradientClass} text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity`}
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
