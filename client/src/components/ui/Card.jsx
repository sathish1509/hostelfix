import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const Card = ({ children, className, hover = false, noPadding = false, premium = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 20 } 
      } : {}}
      className={cn(
        premium ? "card-premium" : "card",
        "overflow-hidden relative group",
        hover && "cursor-pointer",
        !noPadding && "p-6 sm:p-8",
        className
      )}
    >
      {/* Subtle border shine effect on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
