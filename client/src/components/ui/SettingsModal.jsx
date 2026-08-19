import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Phone, Lock, Bell, Moon, Sun,
  Save, CheckCircle2, Eye, EyeOff,
  Shield, Sliders, CheckCircle, XCircle, Key
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import api from "../../utils/api";

const TABS = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "rbac", label: "RBAC Matrix", icon: Key },
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

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
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
    await new Promise((r) => setTimeout(r, 400));
    setIsSaving(false);
    toast.success("Preferences saved!");
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-[#182c3c] bg-dark-50 dark:bg-[#0b1928] text-xs font-mono text-dark-900 dark:text-dark-100 focus:ring-2 focus:ring-[#00c885]/30 focus:border-[#00c885] outline-none transition-all";

  const labelClass = "block text-[10px] font-mono font-bold text-dark-400 uppercase tracking-wider mb-1.5";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#06121e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-dark-200 dark:border-[#182c3c]"
        >
          {/* Header */}
          <div className="bg-[#081520] p-5 border-b border-[#182c3c] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#182c3c] border border-primary-500/30 flex items-center justify-center text-[#00c885] font-mono font-bold text-sm">
                {initials}
              </div>
              <div>
                <h2 className="text-white font-extrabold text-base tracking-tight font-sans">
                  ZeroShield System Settings &amp; Access Controls
                </h2>
                <p className="text-dark-400 font-mono text-[10px]">
                  Proxy configuration, cryptographic identity keys, role permissions, and access bounds
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#182c3c] hover:bg-[#223d54] text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dark-100 dark:border-[#182c3c] flex-shrink-0 bg-dark-50 dark:bg-[#081520]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab.id
                    ? "text-[#00c885]"
                    : "text-dark-400 hover:text-dark-200"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settingsTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c885]"
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
                  className="space-y-4 max-w-xl mx-auto"
                >
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                      <input
                        className={`${inputClass} pl-9`}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Contact</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                      <input
                        className={`${inputClass} pl-9`}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: "Email", value: user?.email },
                      { label: "Role Bound", value: user?.role },
                      user?.block && { label: "Assigned Block", value: `Block ${user.block}` },
                      user?.room && { label: "Room Vector", value: `Room ${user.room}` },
                    ].filter(Boolean).map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-dark-50 dark:bg-[#0b1928] border border-dark-100 dark:border-[#182c3c]">
                        <p className="text-[9px] font-mono text-dark-400 uppercase">{item.label}</p>
                        <p className="text-xs font-mono font-bold text-dark-800 dark:text-dark-200 mt-0.5 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── RBAC MATRIX TAB (MATCHES SCREENSHOT 2) ── */}
              {activeTab === "rbac" && (
                <motion.div
                  key="rbac"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-extrabold text-dark-900 dark:text-white tracking-tight flex items-center gap-2">
                      <User size={16} className="text-[#00c885]" />
                      ZeroShield Role &amp; Access Control Matrix
                    </h3>
                    <p className="text-[10px] font-mono text-dark-400 mt-0.5">
                      Enforced Role-Based Access Control (RBAC) definitions and module access authorization bounds
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Role 1: Administrator */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-sm text-dark-900 dark:text-white">Administrator</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00c885]/10 text-[#00c885] border border-[#00c885]/30">Full Access</span>
                        </div>
                        <p className="text-[10px] text-dark-400 mb-3 leading-relaxed">
                          Managing the entire ZeroShield platform, configuring security policies, and monitoring microservices.
                        </p>
                        <div className="space-y-1.5 text-[10px] font-mono">
                          <p className="font-bold text-[#00c885] uppercase">Permissions:</p>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> View Dashboard</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Monitor Live API Traffic</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Configure Zero Trust Policies</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Generate &amp; Manage JWT Identities</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Manage Users &amp; Roles</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#182c3c]">
                        <button className="w-full py-2 bg-[#081520] text-[#00c885] border border-[#00c885]/30 rounded-lg text-[10px] font-mono font-bold uppercase">
                          Current Active Session Role
                        </button>
                      </div>
                    </div>

                    {/* Role 2: Security Analyst */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-sm text-dark-900 dark:text-white">Security Analyst</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-dark-100 dark:bg-[#182c3c] text-dark-300">Read-Only Monitoring</span>
                        </div>
                        <p className="text-[10px] text-dark-400 mb-3 leading-relaxed">
                          Monitors API communications, investigates suspicious activities, and responds to security incidents.
                        </p>
                        <div className="space-y-1.5 text-[10px] font-mono">
                          <p className="font-bold text-[#00c885] uppercase">Permissions:</p>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> View Dashboard</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Monitor Live Traffic</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> View Audit Logs</div>
                          <p className="font-bold text-rose-500 uppercase mt-2">Restrictions:</p>
                          <div className="flex items-center gap-1.5 text-rose-400"><XCircle size={12} /> Cannot change policies</div>
                          <div className="flex items-center gap-1.5 text-rose-400"><XCircle size={12} /> Cannot create users</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#182c3c]">
                        <button className="w-full py-2 bg-dark-100 dark:bg-[#182c3c] text-dark-400 rounded-lg text-[10px] font-mono font-bold uppercase cursor-not-allowed">
                          Assigned at Authentication
                        </button>
                      </div>
                    </div>

                    {/* Role 3: DevOps Engineer */}
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0b1928] border border-dark-200 dark:border-[#182c3c] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-sm text-dark-900 dark:text-white">DevOps Engineer</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-dark-100 dark:bg-[#182c3c] text-dark-300">Infrastructure Mgt</span>
                        </div>
                        <p className="text-[10px] text-dark-400 mb-3 leading-relaxed">
                          Responsible for deploying and maintaining microservices while ensuring secure Zero Trust proxy communication.
                        </p>
                        <div className="space-y-1.5 text-[10px] font-mono">
                          <p className="font-bold text-[#00c885] uppercase">Permissions:</p>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> Register Microservices</div>
                          <div className="flex items-center gap-1.5 text-dark-300"><CheckCircle2 size={12} className="text-[#00c885]" /> View Service Mesh</div>
                          <p className="font-bold text-rose-500 uppercase mt-2">Restrictions:</p>
                          <div className="flex items-center gap-1.5 text-rose-400"><XCircle size={12} /> Cannot change security policies</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#182c3c]">
                        <button className="w-full py-2 bg-dark-100 dark:bg-[#182c3c] text-dark-400 rounded-lg text-[10px] font-mono font-bold uppercase cursor-not-allowed">
                          Assigned at Authentication
                        </button>
                      </div>
                    </div>
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
                  className="space-y-4 max-w-xl mx-auto"
                >
                  <div className="p-4 rounded-xl bg-dark-50 dark:bg-[#0b1928] border border-dark-100 dark:border-[#182c3c] flex items-start gap-3">
                    <Shield size={18} className="text-[#00c885] flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-dark-400">
                      Keep your cryptographic credentials secure by using a strong password.
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
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
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
                  className="space-y-3 max-w-xl mx-auto"
                >
                  <div className="p-4 rounded-xl border border-dark-100 dark:border-[#182c3c] bg-dark-50 dark:bg-[#0b1928] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? (
                        <Moon size={18} className="text-[#00c885]" />
                      ) : (
                        <Sun size={18} className="text-amber-500" />
                      )}
                      <div>
                        <p className="text-xs font-mono font-bold text-dark-800 dark:text-dark-200">
                          {theme === "dark" ? "Dark Cyber Console" : "Light Console"}
                        </p>
                        <p className="text-[10px] font-mono text-dark-400">Toggle UI visual mode</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        theme === "dark" ? "bg-[#00c885]" : "bg-dark-200"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Save Button */}
          {activeTab !== "rbac" && (
            <div className="p-4 border-t border-dark-100 dark:border-[#182c3c] flex-shrink-0 bg-dark-50 dark:bg-[#081520]">
              <button
                onClick={
                  activeTab === "profile"
                    ? handleSaveProfile
                    : activeTab === "security"
                    ? handleSavePassword
                    : handleSavePreferences
                }
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-[#00c885] hover:bg-[#00b074] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={15} />
                {activeTab === "profile" ? "Save Profile Details" : activeTab === "security" ? "Update Security Password" : "Save Preferences"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
