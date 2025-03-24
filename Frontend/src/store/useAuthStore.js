import {create} from 'zustand';

import {axiosInstance} from '../lib/axios.js';
import {toast} from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');

            set({authUser: res.data});
        } catch (err) {
            console.error("error in check auth", err);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post('/auth/signup', data);
          console.log(res)
          set({ authUser: res.data });
          toast.success(res.data.message);
        } catch (err) {
          toast.error(err.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({isLoqgingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);

            set({authUser: res.data});
            toast.success(res.data.message);

        }
        catch(err){
            toast.error(err.response.data.message);
        }
        finally{
            set({isLoggingIn: false});
        }
    },
    
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (err) {
            console.error("error in logout", err);
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({authUser: res.data});
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

}));