import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  CheckSquare,
  BarChart2,
  Shield,
  Activity,
  Network,
  Radio,
  FileCode,
  History,
  UploadCloud,
  Sliders,
  Settings as SettingsIcon,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const roleLinks = {
    student: [
      { name: "DASHBOARD", path: "/student/dashboard", icon: LayoutDashboard },
      { name: "RAISE COMPLAINT", path: "/student/raise-complaint", icon: PlusCircle, tag: "NEW" },
      { name: "MY COMPLAINTS", path: "/student/my-complaints", icon: FileText, tag: "CORE" },
      { name: "LIVE STATUS", path: "#live", icon: Activity },
      { name: "HOSTEL POLICIES", path: "#policies", icon: FileCode },
      { name: "AUDIT LOGS", path: "#audit", icon: History },
      { name: "SETTINGS", path: "#settings", icon: SettingsIcon },
    ],
    warden: [
      { name: "DASHBOARD", path: "/warden/dashboard", icon: LayoutDashboard },
      { name: "SUPERVISION", path: "/warden/supervision", icon: CheckSquare, tag: "CORE" },
      { name: "ANALYTICS", path: "/warden/analytics", icon: BarChart2 },
      { name: "LIVE TRAFFIC", path: "#traffic", icon: Activity },
      { name: "THREAT DETECTION", path: "#threats", icon: Radio },
      { name: "POLICY ENGINE", path: "#policy", icon: Sliders },
      { name: "AUDIT LOGS", path: "#audit", icon: History },
      { name: "SETTINGS", path: "#settings", icon: SettingsIcon },
    ],
    admin: [
      { name: "DASHBOARD", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "ZERO TRUST PROXY", path: "/admin/complaints", icon: Shield, tag: "CORE" },
      { name: "LIVE TRAFFIC", path: "#traffic", icon: Activity },
      { name: "SERVICE MESH", path: "/admin/rooms", icon: Network },
      { name: "THREAT DETECTION", path: "/admin/users", icon: Radio },
      { name: "POLICY ENGINE", path: "#policy", icon: Sliders },
      { name: "AUDIT LOGS", path: "#audit", icon: History },
      { name: "UPLOAD LOGS", path: "#upload", icon: UploadCloud },
      { name: "ANALYTICS", path: "#analytics", icon: BarChart2 },
      { name: "SETTINGS", path: "#settings", icon: SettingsIcon },
    ],
  };

  const links = roleLinks[user?.role] || roleLinks.student;

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 sidebar transition-transform duration-300 transform lg:translate-x-0 border-r border-dark-200 dark:border-[#182c3c]",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full bg-white dark:bg-[#06121e]">
        {/* Top Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-dark-100 dark:border-[#182c3c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#081520] border border-[#182c3c] flex items-center justify-center text-[#00c885] shadow-sm">
              <Shield className="w-5 h-5 fill-[#00c885]/20 text-[#00c885]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-dark-900 dark:text-white font-sans">
                  ZeroShield
                </span>
                <span className="px-1 py-0.5 text-[9px] font-mono font-bold bg-dark-100 dark:bg-[#081520] text-[#00c885] rounded border border-primary-500/20">
                  v3.4
                </span>
              </div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-dark-400">
                SOC COMMAND CENTER
              </p>
            </div>
          </div>
        </div>

        {/* ZeroShield Proxy Banner Card */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-dark-50 dark:bg-[#081520] border border-dark-200 dark:border-[#182c3c] shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00c885]/10 border border-[#00c885]/30 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-[#00c885]" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white">
                ZEROSHIELD PROXY
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c885] animate-pulse" />
                <span className="text-[9px] font-mono font-semibold text-[#00c885]">
                  mesh active (mTLS 1.3)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link, index) => (
            <motion.div
              key={link.name + index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <NavLink
                to={link.path.startsWith('#') ? '#' : link.path}
                onClick={(e) => {
                  if (link.path.startsWith('#')) e.preventDefault();
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) => {
                  const isCurrentActive = !link.path.startsWith('#') && isActive;
                  return cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group text-xs font-mono font-bold tracking-wider uppercase",
                    isCurrentActive
                      ? "bg-[#00c885] text-white shadow-sm shadow-emerald-500/20"
                      : "text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-[#0b1928] hover:text-dark-900 dark:hover:text-white"
                  );
                }}
              >
                {({ isActive }) => {
                  const isCurrentActive = !link.path.startsWith('#') && isActive;
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <link.icon
                          className={cn(
                            "w-4 h-4 transition-transform group-hover:scale-110",
                            isCurrentActive ? "text-white" : "text-dark-400 dark:text-dark-500 group-hover:text-primary-500"
                          )}
                        />
                        <span>{link.name}</span>
                      </div>
                      {link.tag && (
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[8px] font-mono font-extrabold uppercase tracking-tighter",
                            isCurrentActive
                              ? "bg-black/20 text-white"
                              : "bg-[#081520] text-[#00c885] border border-[#182c3c]"
                          )}
                        >
                          {link.tag}
                        </span>
                      )}
                    </>
                  );
                }}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-dark-100 dark:border-[#182c3c]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-[#081520] border border-dark-200 dark:border-[#182c3c]">
            <div className="w-8 h-8 rounded-lg bg-[#182c3c] flex items-center justify-center text-[#00c885] font-mono font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-dark-900 dark:text-white truncate">
                {user?.name || "SecOps Admin"}
              </p>
              <p className="text-[9px] font-mono text-dark-400 truncate">
                {user?.role ? `${user.role.toUpperCase()} NODE` : "ADMIN NODE"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
