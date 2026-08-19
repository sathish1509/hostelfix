import { useState } from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useComplaint } from "../../context/ComplaintContext";
import { useAuth } from "../../context/AuthContext";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const RaiseComplaint = () => {
    const { addComplaint } = useComplaint();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Electrical");
    const [priority, setPriority] = useState("Medium");
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'image' or 'video'

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type.split('/')[0]; // 'image' or 'video'
            
            if (fileType !== 'image' && fileType !== 'video') {
                alert("Only images and videos are allowed");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setMedia(reader.result);
                setMediaType(fileType);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newComplaint = {
            description: `[${title}] ${description}`,
            category,
            urgency: priority,
            attachment: media, 
            attachmentType: mediaType,
        };

        // Real API call
        addComplaint(newComplaint)
            .then(() => {
                setIsSubmitting(false);
                navigate('/student/dashboard');
            })
            .catch(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-dark-950 dark:text-white mb-3">
                  Raise New Complaint
                </h1>
                <p className="text-dark-500 dark:text-dark-400 font-medium">
                  Provide details about your issue and we'll get it fixed.
                </p>
            </motion.div>
            
            <Card premium className="!p-8 sm:!p-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <Input 
                        label="Complaint Title" 
                        placeholder="e.g., Leaking Tap in Bathroom" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest pl-1">
                              Category
                            </label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900/50 text-dark-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 font-medium appearance-none cursor-pointer"
                            >
                                <option>Electrical</option>
                                <option>Plumbing</option>
                                <option>Carpentry</option>
                                <option>Cleaning</option>
                                <option>Internet</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest pl-1">
                              Priority Level
                            </label>
                            <div className="flex bg-dark-100/50 dark:bg-dark-800/30 p-1.5 rounded-2xl border border-dark-200/50 dark:border-dark-700/50">
                                {['Low', 'Medium', 'High'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                                            priority === p 
                                            ? p === 'High' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 
                                              p === 'Medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 
                                              'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'text-dark-400 dark:text-dark-500 hover:text-dark-700 dark:hover:text-dark-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest pl-1">
                          Description
                        </label>
                        <textarea
                            rows="5"
                            placeholder="Please provide as much detail as possible to help us solve the issue faster..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-900/50 text-dark-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 font-medium resize-none placeholder:text-dark-400 dark:placeholder:text-dark-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest pl-1">
                          Visual Evidence (Optional)
                        </label>
                        <div className="relative group/upload h-64">
                            <input 
                                type="file" 
                                accept="image/*,video/*" 
                                onChange={handleFileUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className={cn(
                              "absolute inset-0 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-500 z-10",
                              media ? "border-primary-500/50 bg-primary-50/10 dark:bg-primary-900/5" : "border-dark-200 dark:border-dark-800 group-hover/upload:border-primary-400 group-hover/upload:bg-dark-50 dark:group-hover/upload:bg-dark-800/20"
                            )}>
                                {media ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-4">
                                        {mediaType === 'video' ? (
                                            <video src={media} controls className="max-w-full max-h-full rounded-2xl shadow-xl bg-dark-950 border border-dark-800" />
                                        ) : (
                                            <img src={media} alt="Preview" className="max-w-full max-h-full rounded-2xl shadow-xl border border-dark-100 dark:border-dark-800" />
                                        )}
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setMedia(null); setMediaType(null); }}
                                            className="absolute top-6 right-6 bg-rose-500 text-white rounded-full p-2 shadow-2xl hover:scale-110 active:scale-95 transition-all z-30"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center px-10">
                                        <div className="w-16 h-16 rounded-3xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-500">
                                          <Upload size={32} className="text-dark-400 dark:text-dark-500 group-hover/upload:text-primary-500 transition-colors" />
                                        </div>
                                        <p className="text-dark-900 dark:text-white font-bold text-lg tracking-tight mb-1">Upload Photo or Video</p>
                                        <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">Drag and drop files here or click to browse</p>
                                        <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-dark-400">
                                          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-dark-300" /> Max 10MB</span>
                                          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-dark-300" /> ALL FORMATS</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button type="submit" isLoading={isSubmitting} className="w-full !rounded-[1.5rem]" size="lg">
                            Submit Request
                        </Button>
                        <p className="text-center text-xs text-dark-400 dark:text-dark-500 font-bold mt-6 tracking-widest uppercase flex items-center justify-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          Platform Secure Resolution
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RaiseComplaint;
