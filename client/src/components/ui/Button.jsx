import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading, 
  type = 'button',
  onClick,
  disabled
}) => {
  const variants = {
    primary: "bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/25 hover:shadow-primary-600/40 hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-200 dark:border-dark-700 shadow-sm hover:bg-dark-50 dark:hover:bg-dark-700 hover:-translate-y-0.5 transition-all duration-300",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 hover:-translate-y-0.5 transition-all duration-300",
    ghost: "text-dark-600 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-dark-800 transition-all duration-300",
    danger: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-xl shadow-rose-500/25 hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all duration-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] font-bold uppercase tracking-wider",
    md: "px-6 py-3 text-xs font-bold uppercase tracking-widest",
    lg: "px-8 py-4 text-sm font-bold uppercase tracking-[0.15em]",
    icon: "p-3",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      type={type}
      className={cn(
        "relative flex items-center justify-center rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
