import { Bell, Menu, Sun, Moon, ChevronDown, User, Settings, LogOut, Search, Sparkles, RefreshCw, ShieldAlert } from "lucide-react";
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
    : "A";

  const studentStatusOptions = [
    { id: 'stayed', label: 'Available', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    { id: 'not-in-hostel', label: 'Currently Not In', color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    { id: 'left-hostel', label: 'Leave', color: 'bg-rose-500', ring: 'ring-rose-500/20' },
  ];

  const staffStatusOptions = [
    { id: 'stayed', label: 'On Duty', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
    { id: 'not-in-hostel', label: 'Off Duty', color: 'bg-amber-500', ring: 'ring-amber-500/20' },
    { id: 'left-hostel', label: 'On Leave', color: 'bg-rose-500', ring: 'ring-rose-500/20' },
  ];

  const statusOptions = user?.role === 'student' ? studentStatusOptions : staffStatusOptions;
  const currentStatusId = user?.statusId || "stayed";
  const currentStatus = statusOptions.find(s => s.id === currentStatusId) || statusOptions[0];

  return (
    <>
      <header className="h-20 fixed top-0 right-0 left-0 lg:left-72 z-40 navbar px-6 flex items-center justify-between transition-all duration-300 bg-white/90 dark:bg-[#06121e]/90 backdrop-blur-md border-b border-dark-100 dark:border-[#182c3c]">
        {/* Left Section: Mobile Menu & Console Header */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#081520] border border-[#182c3c] flex items-center justify-center text-[#00c885] font-bold text-sm shadow-sm">
              <ShieldAlert size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-dark-900 dark:text-white tracking-tight leading-none">
                  ZeroShield Security Console
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#081520] text-[#00c885] border border-primary-500/30">
                  v3.4
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400 dark:text-dark-400 mt-1">
                SOC COMMAND CENTER &bull; HOSTELFIX ENGINE
              </p>
            </div>
          </div>
        </div>

        {/* Center Section: ZeroShield Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="w-full relative flex items-center">
            <Search className="w-4 h-4 text-dark-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search endpoints, IP records, security logs (Press ⌘K)..."
              className="w-full pl-10 pr-12 py-2 rounded-full border border-dark-200 dark:border-[#182c3c] bg-dark-50/80 dark:bg-[#0b1928] text-xs text-dark-900 dark:text-dark-100 placeholder:text-dark-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 font-mono transition-all"
            />
            <span className="absolute right-3 px-1.5 py-0.5 rounded bg-dark-200 dark:bg-[#182c3c] text-[9px] font-mono font-bold text-dark-500 dark:text-dark-400">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Section: AI Analyst + Roles + Profile */}
        <div className="flex items-center space-x-3">
          {/* Gemini AI Analyst Pill */}
          <button className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081520] hover:bg-[#0c1e2d] text-white border border-emerald-500/40 shadow-sm transition-all duration-300 group">
            <Sparkles className="w-3.5 h-3.5 text-[#00c885] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#00c885] tracking-tight group-hover:underline">
              Gemini AI Analyst
            </span>
          </button>

          {/* Role Pill Selector */}
          <div className="hidden md:flex items-center p-1 bg-[#081520] rounded-full border border-[#182c3c] text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400">
            {['admin', 'warden', 'student'].map((r) => {
              const labelMap = { admin: 'SOC ADMIN', warden: 'ANALYST', student: 'DEVOPS' };
              const isActive = (user?.role || 'admin') === r;
              return (
                <span
                  key={r}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-default ${
                    isActive
                      ? "bg-[#182c3c] text-white font-extrabold shadow-sm"
                      : "text-dark-400 hover:text-dark-200"
                  }`}
                >
                  {labelMap[r]}
                </span>
              );
            })}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            title="Refresh System Baseline"
            className="p-2.5 rounded-full text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-[#0b1928] transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-dark-400 hover:text-primary-500 transition-transform active:rotate-180" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-[#0b1928] transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-full text-dark-500 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-[#0b1928] transition-all duration-300 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#00c885] rounded-full border-2 border-white dark:border-[#06121e] animate-pulse" />
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-6 bg-dark-200 dark:bg-[#182c3c] mx-1 hidden sm:block" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-dark-100 dark:hover:bg-[#0b1928] transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#081520] border border-primary-500/50 flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${currentStatus.color} rounded-full border-2 border-white dark:border-[#06121e]`} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-dark-900 dark:text-white truncate max-w-[110px] tracking-tight leading-tight">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-[9px] font-mono text-dark-400 dark:text-dark-400 truncate max-w-[120px] leading-tight">
                  {user?.email || "admin@zeroshield.io"}
                </p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-dark-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#081520] rounded-2xl shadow-xl border border-dark-100 dark:border-[#182c3c] overflow-hidden z-50 p-2"
                >
                  {/* Profile Header */}
                  <div className="p-4 rounded-xl bg-dark-50 dark:bg-[#0b1928] border border-dark-100 dark:border-[#182c3c] mb-2 relative overflow-hidden group">
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#081520] border border-primary-500/40 flex items-center justify-center text-[#00c885] font-mono font-bold text-base">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-dark-900 dark:text-white font-extrabold text-sm tracking-tight truncate">{user?.name}</p>
                        <p className="text-[#00c885] text-[10px] font-mono uppercase font-bold tracking-wider">{user?.role} Access</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div className="px-1 mb-2">
                    <div className="flex items-center justify-between p-1 bg-dark-50 dark:bg-[#0b1928] rounded-xl border border-dark-100 dark:border-[#182c3c]">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateUser({ ...user, statusId: opt.id, currentStatus: opt.label, statusColor: opt.color })}
                          title={opt.label}
                          className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all duration-300 ${
                            currentStatusId === opt.id 
                            ? 'bg-white dark:bg-[#182c3c] shadow-sm scale-105' 
                            : 'opacity-40 hover:opacity-100'
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-[#0b1928] rounded-xl transition-all duration-200"
                    >
                      <User size={15} className="text-primary-500" />
                      View Profile
                    </button>
                    <button
                      onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-[#0b1928] rounded-xl transition-all duration-200"
                    >
                      <Settings size={15} className="text-amber-500" />
                      System Settings
                    </button>
                    <div className="border-t border-dark-100 dark:border-[#182c3c] my-1 mx-2" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-200"
                    >
                      <LogOut size={15} />
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
