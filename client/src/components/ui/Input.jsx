import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon: Icon,
  required
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
            Icon && "pl-10",
            isPassword && "pr-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 font-medium ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
