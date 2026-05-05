
import { User, Phone, MapPin, Users, Building } from "lucide-react";
import { Card } from "../ui/Card";

const ProfileCard = ({ user }) => {
    if (!user) return null;

    return (
        <Card className="bg-white dark:bg-dark-900 shadow-premium !rounded-[2.5rem] overflow-hidden relative border border-dark-100 dark:border-dark-800/50 group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full filter blur-3xl group-hover:bg-primary-500/10 transition-colors duration-700"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 p-8 sm:p-10">
                
                {/* Avatar Section */}
                <div className="flex-shrink-0 relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-3xl opacity-20 blur-lg group-hover:opacity-40 transition duration-700"></div>
                    <div className="relative w-32 h-32 rounded-[2rem] border-4 border-white dark:border-dark-800 overflow-hidden shadow-2xl transform transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                        <img 
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-dark-800 rounded-2xl z-20 shadow-lg" title="Active"></div>
                </div>

                {/* Info Section */}
                <div className="flex-1 w-full text-center md:text-left space-y-6">
                    <div className="space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <h2 className="text-4xl font-extrabold tracking-tight text-dark-900 dark:text-white">
                              {user.name}
                          </h2>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-800/50">
                                  Block {user.block}
                              </span>
                              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50">
                                  Room {user.room}
                              </span>
                          </div>
                        </div>
                        <p className="text-dark-500 dark:text-dark-400 font-medium text-lg italic">
                          "{user.bio || 'Passionate student community member'}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                        {/* Mobile */}
                        <div className="p-4 bg-dark-50 dark:bg-dark-800/30 rounded-2xl border border-dark-100 dark:border-dark-800/40 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 group/item">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 rounded-xl shadow-sm group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">Mobile</p>
                                    <p className="text-sm font-bold text-dark-800 dark:text-dark-100">{user.phone || "Not Added"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Parents */}
                        <div className="p-4 bg-dark-50 dark:bg-dark-800/30 rounded-2xl border border-dark-100 dark:border-dark-800/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group/item">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-dark-800 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">Parents</p>
                                    <p className="text-sm font-bold text-dark-800 dark:text-dark-100">{user.parentPhone || "Not Added"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                         <div className="p-4 bg-dark-50 dark:bg-dark-800/30 rounded-2xl border border-dark-100 dark:border-dark-800/40 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 group/item sm:col-span-2 lg:col-span-1">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-dark-800 text-amber-600 dark:text-amber-400 rounded-xl shadow-sm group-hover/item:scale-110 group-hover/item:rotate-6 transition-transform">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-widest">Status</p>
                                    <p className="text-sm font-bold text-dark-800 dark:text-dark-100 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      {user.currentStatus || "Inside Hostel"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileCard;
