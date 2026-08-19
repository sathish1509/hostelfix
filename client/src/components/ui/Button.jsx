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
    primary: "bg-[#00c885] hover:bg-[#00b074] text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5",
    dark: "bg-[#081520] hover:bg-[#0c1e2d] text-white border border-[#182c3c] shadow-sm hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-[#0b1928] text-dark-800 dark:text-dark-100 border border-dark-200 dark:border-[#182c3c] shadow-sm hover:bg-dark-50 dark:hover:bg-[#0e2032] hover:-translate-y-0.5",
    outline: "border border-[#00c885] text-[#00c885] hover:bg-[#00c885]/10 hover:-translate-y-0.5",
    ghost: "text-dark-600 hover:bg-dark-100 dark:text-dark-400 dark:hover:bg-[#0b1928]",
    danger: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20 hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-3.5 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl",
    md: "px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl",
    lg: "px-7 py-3 text-xs font-mono font-bold uppercase tracking-widest rounded-xl",
    icon: "p-2.5 rounded-xl",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      type={type}
      className={cn(
        "relative flex items-center justify-center font-mono font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
