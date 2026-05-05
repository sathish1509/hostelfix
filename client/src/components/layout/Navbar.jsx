import { Bell, Menu, Sun, Moon, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";
import ProfileModal from "../ui/ProfileModal";
import SettingsModal from "../ui/SettingsModal";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [status, setStatus] = useState("stayed");
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const roleColors = {
    student: "from-blue-500 to-indigo-600",
    warden: "from-emerald-500 to-teal-600",
    admin: "from-purple-500 to-pink-600",
  };
  const gradientClass = roleColors[user?.role] || "from-primary-500 to-primary-700";

  const studentStatusOptions = [
    { id: 'stayed', label: 'In Hostel', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    { id: 'not-in-hostel', label: 'On Leave', color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    { id: 'left-hostel', label: 'Left Hostel', color: 'bg-rose-500', ring: 'ring-rose-500/20' },
    { id: 'graduated', label: 'Graduated', color: 'bg-indigo-500', ring: 'ring-indigo-500/20' },
  ];

  const staffStatusOptions = [
    { id: 'stayed', label: 'On Duty', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    { id: 'not-in-hostel', label: 'Off Duty', color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    { id: 'left-hostel', label: 'On Leave', color: 'bg-rose-500', ring: 'ring-rose-500/20' },
  ];

  const statusOptions = user?.role === 'student' ? studentStatusOptions : staffStatusOptions;

  const currentStatus = statusOptions.find(s => s.id === status) || statusOptions[0];

  return (
    <>
    <header className="h-20 fixed top-0 right-0 left-0 lg:left-72 z-40 navbar px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 rounded-xl text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-xs font-semibold text-dark-400 dark:text-dark-500 tracking-wide mt-0.5">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 rounded-xl text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-all duration-300 hover:scale-105 active:scale-95 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-dark-950 animate-pulse" />
          </button>
          <AnimatePresence>
            {isNotifOpen && (
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-8 bg-dark-100 dark:bg-dark-800/50 mx-2 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-dark-100 dark:hover:bg-dark-800/50 transition-all duration-300 group"
          >
            {/* Avatar with Status Dot */}
            <div className="relative">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-105`}>
                {initials}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${currentStatus.color} rounded-full border-2 border-white dark:border-dark-900 shadow-sm`} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-dark-900 dark:text-white truncate max-w-[100px] tracking-tight">
                {user?.name?.split(" ")[0]}
              </p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 ${currentStatus.color} rounded-full`} />
                  <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-tighter">
                    {user?.role}
                  </p>
                  <ChevronDown
                    className={`w-3 h-3 text-dark-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute right-0 mt-3 w-64 bg-white dark:bg-dark-900 rounded-[2rem] shadow-premium border border-dark-100 dark:border-dark-800 overflow-hidden z-50 p-2"
              >
                {/* Profile Header */}
                <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${gradientClass} mb-2 relative overflow-hidden group`}>
                   {/* Decorative circle */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold text-lg">
                        {initials}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${currentStatus.color} rounded-full border-2 border-white dark:border-dark-950 shadow-lg`} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm tracking-tight">{user?.name}</p>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="px-2 mb-2">
                  <div className="flex items-center justify-between p-1 bg-dark-50 dark:bg-dark-800/50 rounded-xl border border-dark-100 dark:border-dark-800/50">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setStatus(opt.id)}
                        title={opt.label}
                        className={`w-1/4 py-1.5 flex justify-center rounded-lg transition-all duration-300 ${
                          status === opt.id 
                          ? 'bg-white dark:bg-dark-700 shadow-sm scale-110 z-10' 
                          : 'hover:bg-dark-100/50 dark:hover:bg-dark-800/50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${opt.color} ${status === opt.id ? `ring-4 ${opt.ring}` : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <User size={16} />
                    </div>
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 group"
                    onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                      <Settings size={16} />
                    </div>
                    Settings
                  </button>
                  <div className="border-t border-dark-100 dark:border-dark-800 my-2 mx-2" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                      <LogOut size={16} />
                    </div>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            user={user}
            onClose={() => setIsSettingsOpen(false)}
            onUpdateUser={(updated) => { updateUser(updated); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
