/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const ComplaintContext = createContext();

export const useComplaint = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let res;
      if (user.role === 'admin') {
        res = await api.get('/complaints/all');
      } else if (user.role === 'warden') {
        res = await api.get('/complaints/warden');
      } else {
        res = await api.get('/complaints/my');
      }
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    } else {
      setComplaints([]);
    }
  }, [user, fetchComplaints]);

  const addComplaint = async (complaintData) => {
    try {
      const res = await api.post('/complaints', complaintData);
      setComplaints([res.data, ...complaints]);
      toast.success("Complaint raised successfully!");
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error('Failed to raise complaint');
      throw error;
    }
  };

  const updateStatus = async (id, newStatus, _note = "") => {
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus });
      setComplaints(complaints.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
      throw error;
    }
  };

  const escalateComplaint = async (id) => {
    await updateStatus(id, "Escalated", "Escalated to Admin due to delay");
  };
  
  const upvoteComplaint = async (_id) => {
    // Optional implementation if upvote is needed, 
    // for now we just do nothing or toast
    toast.success("Upvoted!");
  };

  return (
    <ComplaintContext.Provider value={{ 
      complaints, 
      loading, 
      addComplaint, 
      updateStatus, 
      escalateComplaint, 
      upvoteComplaint,
      refreshComplaints: fetchComplaints 
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};
