import { create } from 'zustand';
import axios from 'axios';

export const useAuth = create((set) => ({
    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,

    // Login route

    login: async (userCredWithRole) => {
      const { role, ...userCredObj } = userCredWithRole;
      try {
        //set loading true
        set({ loading: true, error: null });
        //make api call
        let res = await axios.post("http://localhost:4000/common-api/login", userCredObj , {withCredentials:true});
        console.log("res is ", res);
        //update state
        set({
          loading: false,
          isAuthenticated: true,
          currentUser: res.data.payload,
        });
      } catch (err) {
        console.log("err is ", err);
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
          error: err.response?.data?.error || err.message,
        });
      }
    },

    // Logout route
    
    logout: async () => {
      try {
        //set loading state
        set({ loading: true, error: null });
        //make logout api request
        let res = await axios.get("http://localhost:4000/common-api/logout", {withCredentials:true});
        console.log("res is ", res);
        //update state
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
        });
      } catch (error) {
        set({
          loading: false,
          isAuthenticated: false,
          currentUser: null,
          error: error.response?.data?.error || "Logout failed",
        });
      }
    }
}));