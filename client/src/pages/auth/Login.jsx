import { useState } from "react";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Lock, User, AtSign, Building2 } from "lucide-react";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(formData.email, formData.password, formData.role);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-900 rounded-lg p-8 shadow-sm border border-dark-200 dark:border-dark-800 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 mb-6">
            <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-dark-900 dark:text-white mb-2">
            Sign In
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Access your hostel dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Tab Switcher */}
            <div className="flex bg-dark-100 dark:bg-dark-800 rounded-md p-1 border border-dark-200 dark:border-dark-700">
                {['student', 'warden', 'admin'].map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`flex-1 py-2 text-sm font-medium rounded-sm capitalize transition-colors ${
                            formData.role === role 
                            ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm' 
                            : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-300'
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
              <Input
                icon={AtSign}
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Sign In
          </Button>

          {formData.role === 'student' && (
            <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-8 font-medium">
                Don't have an account? 
                <a href="/signup" className="text-primary-600 dark:text-primary-400 hover:underline font-bold ml-1">Create free account</a>
            </p>
          )}

        </form>
      </div>
    </div>
  );
};
