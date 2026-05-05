import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { User, Mail, Lock, Building, Layers } from "lucide-react";
import { toast } from "react-hot-toast";
import { registerUser } from "../../services/authService";

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        block: "",
        roomNo: "",
        password: "",
        role: "student"
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await registerUser({
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`
            });
            toast.success("Account created! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950 p-6 relative overflow-hidden">
             {/* Advanced Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -50, 0],
                    y: [0, 100, 0]
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px]" 
                />
                <motion.div 
                   animate={{ 
                    scale: [1, 1.3, 1],
                    x: [0, 80, 0],
                    y: [0, -60, 0]
                  }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px]" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0,transparent_70%)]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                className="w-full max-w-xl glass-panel rounded-[3rem] shadow-premium p-10 lg:p-14 border border-white/40 dark:border-white/5 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary-600 to-indigo-600 mb-8 shadow-2xl shadow-primary-500/40 relative"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-pulse" />
                      <Building className="w-10 h-10 text-white relative z-10" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-3">Join the Community</h1>
                    <p className="text-dark-500 dark:text-dark-400 font-medium">Create your credentials to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input 
                            icon={User} 
                            placeholder="First Name" 
                            required 
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <Input 
                            icon={User} 
                            placeholder="Last Name" 
                            required 
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                    
                    <Input 
                        icon={Mail} 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input 
                            icon={Layers} 
                            placeholder="Block (e.g., A)" 
                            required 
                            value={formData.block}
                            onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        />
                        <Input 
                            icon={Building} 
                            placeholder="Room No (e.g., 101)" 
                            required 
                            value={formData.roomNo}
                            onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input 
                            icon={Lock} 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <Input 
                            icon={Lock} 
                            type="password" 
                            placeholder="Confirm Password" 
                            required 
                        />
                    </div>

                    <div className="pt-6">
                        <Button type="submit" isLoading={isLoading} className="w-full py-4 text-sm font-bold tracking-widest uppercase">
                            Create Account
                        </Button>
                    </div>

                    <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-8 font-medium">
                        Already have an account? 
                        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-bold ml-1">
                            Sign In
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
