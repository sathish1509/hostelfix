import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Phone, Lock, Bell, Moon, Sun,
  Save, CheckCircle, Eye, EyeOff, Settings,
  Shield, Sliders, ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import api from "../../utils/api";

const TABS = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Sliders },
];

const SettingsModal = ({ user, onClose, onUpdateUser }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    parentPhone: user?.parentPhone || "",
    currentStatus: user?.currentStatus || "In Hostel",
  });

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false,
  });

  // Preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifs: true,
    statusUpdates: true,
    newComplaints: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const roleColors = {
    student: "from-blue-500 to-indigo-600",
    warden: "from-emerald-500 to-teal-600",
    admin: "from-purple-500 to-pink-600",
  };
  const gradientClass = roleColors[user?.role] || "from-primary-500 to-primary-700";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate save
    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    onUpdateUser?.(updatedUser);
    setIsSaving(false);
    toast.success("Profile updated successfully!");
  };

  const handleSavePassword = async () => {
    if (!securityForm.currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (securityForm.newPassword.length < 3) {
      toast.error("New password must be at least 3 characters");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      });
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Preferences saved!");
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 outline-none transition-all";

  const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5";

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
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${gradientClass} p-5 flex items-center justify-between flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Settings</h2>
                <p className="text-white/70 text-xs capitalize">{user?.name} · {user?.role}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settingsTabIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradientClass}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* ── EDIT PROFILE TAB ── */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        className={`${inputClass} pl-9`}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        className={`${inputClass} pl-9`}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {user?.role === "student" && (
                    <>
                      <div>
                        <label className={labelClass}>Parent Contact</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            className={`${inputClass} pl-9`}
                            value={profileForm.parentPhone}
                            onChange={(e) => setProfileForm({ ...profileForm, parentPhone: e.target.value })}
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Current Status</label>
                        <select
                          className={inputClass}
                          value={profileForm.currentStatus}
                          onChange={(e) => setProfileForm({ ...profileForm, currentStatus: e.target.value })}
                        >
                          <option value="In Hostel">In Hostel</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Day Scholar">Day Scholar</option>
                          <option value="Graduated">Graduated</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Read-only info */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: "Email", value: user?.email },
                      { label: "Role", value: user?.role },
                      user?.block && { label: "Block", value: `Block ${user.block}` },
                      user?.room && { label: "Room", value: `Room ${user.room}` },
                    ].filter(Boolean).map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── SECURITY TAB ── */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                    <Shield size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Keep your account secure by using a strong, unique password.
                    </p>
                  </div>

                  {[
                    { key: "current", label: "Current Password", placeholder: "Enter current password" },
                    { key: "new", label: "New Password", placeholder: "Enter new password" },
                    { key: "confirm", label: "Confirm New Password", placeholder: "Re-enter new password" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPasswords[key] ? "text" : "password"}
                          className={`${inputClass} pl-9 pr-10`}
                          value={securityForm[key === "current" ? "currentPassword" : key === "new" ? "newPassword" : "confirmPassword"]}
                          onChange={(e) => setSecurityForm({
                            ...securityForm,
                            [key === "current" ? "currentPassword" : key === "new" ? "newPassword" : "confirmPassword"]: e.target.value
                          })}
                          placeholder={placeholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPasswords[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ── PREFERENCES TAB ── */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* Theme Toggle */}
                  <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                        {theme === "dark" ? (
                          <Moon size={18} className="text-amber-500" />
                        ) : (
                          <Sun size={18} className="text-amber-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </p>
                        <p className="text-xs text-gray-500">Toggle app appearance</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        theme === "dark" ? "bg-primary-600" : "bg-gray-200"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>

                  {/* Notification Prefs */}
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-2">
                    Notifications
                  </p>
                  {[
                    { key: "emailNotifs", label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "statusUpdates", label: "Status Updates", desc: "When your complaint status changes" },
                    { key: "newComplaints", label: "New Complaints", desc: "Alerts for new complaints in your block" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                          <Bell size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifPrefs({ ...notifPrefs, [key]: !notifPrefs[key] })}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          notifPrefs[key] ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          notifPrefs[key] ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Save Button */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={
                activeTab === "profile"
                  ? handleSaveProfile
                  : activeTab === "security"
                  ? handleSavePassword
                  : handleSavePreferences
              }
              disabled={isSaving}
              className={`w-full py-3 rounded-2xl bg-gradient-to-r ${gradientClass} text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {activeTab === "profile" ? "Save Profile" : activeTab === "security" ? "Change Password" : "Save Preferences"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
