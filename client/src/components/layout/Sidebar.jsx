import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  CheckSquare,
  BarChart2,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const roleLinks = {
    student: [
      { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
      { name: "Raise Complaint", path: "/student/raise-complaint", icon: PlusCircle },
      { name: "My Complaints", path: "/student/my-complaints", icon: FileText },
    ],
    warden: [
      { name: "Dashboard", path: "/warden/dashboard", icon: LayoutDashboard },
      { name: "Supervision", path: "/warden/supervision", icon: CheckSquare },
      { name: "Analytics", path: "/warden/analytics", icon: BarChart2 },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "Complaints", path: "/admin/complaints", icon: FileText },
      { name: "Rooms", path: "/admin/rooms", icon: CheckSquare },
    ],
  };

  const links = roleLinks[user?.role] || [];

  const roleColors = {
    student: "from-indigo-500 to-blue-600",
    warden: "from-emerald-500 to-teal-600",
    admin: "from-violet-500 to-purple-600",
  };
  const gradientClass = roleColors[user?.role] || "from-primary-500 to-primary-600";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 sidebar transition-transform duration-300 transform lg:translate-x-0 border-r border-dark-100 dark:border-dark-800/50",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full bg-white dark:bg-dark-950">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-dark-100/50 dark:border-dark-800/30">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg shadow-primary-500/20`}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-dark-900 to-dark-600 dark:from-white dark:to-dark-400">
              HostelFix
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-400 dark:text-dark-500">
              Main Menu
            </p>
          </div>
          {links.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={link.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group text-sm font-semibold tracking-tight",
                    isActive
                      ? `bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400`
                      : "text-dark-500 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-900/40 hover:text-dark-900 dark:hover:text-dark-100"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={cn("w-5 h-5 mr-3 transition-all duration-300 group-hover:scale-110", isActive ? "text-primary-600 dark:text-primary-400" : "text-dark-400 dark:text-dark-500")} />
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-6 rounded-full bg-primary-600 dark:bg-primary-400"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-dark-100/50 dark:border-dark-800/30">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-dark-50 dark:bg-dark-900/40 border border-dark-100/50 dark:border-dark-800/20 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-base font-bold shadow-lg shadow-primary-500/10 flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark-900 dark:text-white truncate tracking-tight">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse`} />
                <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
