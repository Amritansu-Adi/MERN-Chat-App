import {create} from 'zustand';
import { io } from 'socket.io-client';

import {axiosInstance} from '../lib/axios.js';
import {toast} from 'react-hot-toast';

const BASE_URL = import.meta.env.MODE === 'development'? "http://localhost:5000" : "/" // Use the appropriate base URL for your environment

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    onlineUsers: [],

    socket: null,
    
    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check');

            set({authUser: res.data});

            get().connectSocket();
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

          get().connectSocket();
        } catch (err) {
          toast.error(err.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);

            set({authUser: res.data});
            toast.success(res.data.message);

            get().connectSocket();
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
            get().disconnectSocket();
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

    connectSocket: () => {
        const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));