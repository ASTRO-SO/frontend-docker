"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create a shared context for authentication state
export const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userRole: null
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  
  // Check login status on mount and when auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn");
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole");
      
      const isAuthenticated = loggedInStatus === "true" && !!token;
      console.log("Auth Provider - Auth check:", {
        loggedInStatus,
        hasToken: !!token,
        tokenValue: token ? token.substring(0, 10) + "..." : "none",
        isAuthenticated,
        role: storedRole
      });
      
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated && storedRole) {
        setUserRole(storedRole);
      } else {
        setUserRole(null);
      }
    };
    
    // Check on mount
    checkAuth();
    
    // Set up event listeners
    const handleLoginStateChanged = () => {
      console.log("AuthProvider: Login state change detected");
      checkAuth();
    };
    
    window.addEventListener("loginStateChanged", handleLoginStateChanged);
    window.addEventListener("storage", (e) => {
      if (e.key === "isLoggedIn" || e.key === "token" || e.key === "userRole") {
        handleLoginStateChanged();
      }
    });
    
    // Recheck periodically
    const intervalId = setInterval(checkAuth, 3000);
    
    return () => {
      window.removeEventListener("loginStateChanged", handleLoginStateChanged);
      clearInterval(intervalId);
    };
  }, []);
  
  // Enhanced login function with better validation and error handling
  const login = (token, role) => {
    if (!token) {
      console.error("Login failed: No token provided");
      return;
    }
    
    // Make sure token is a string
    const tokenString = String(token);
    
    // Make sure role is properly stored even if it's "admin"
    const roleString = role ? String(role) : "user";
    
    console.log("Setting auth data:", {
      token: tokenString.substring(0, 10) + "...",
      role: roleString
    });
    
    try {
      // Clear any existing auth data first
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      
      // Set new auth data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", tokenString);
      localStorage.setItem("userRole", roleString);
      
      // Verify data was set correctly
      const storedToken = localStorage.getItem("token");
      const storedLogin = localStorage.getItem("isLoggedIn");
      const storedRole = localStorage.getItem("userRole");
      
      console.log("Verification after setting:", {
        tokenStored: !!storedToken,
        tokenValue: storedToken ? storedToken.substring(0, 10) + "..." : "none",
        loginStatus: storedLogin,
        roleStored: storedRole
      });
      
      // Update state
      setIsLoggedIn(true);
      setUserRole(roleString);
      
      // Notify other components
      window.dispatchEvent(new Event("loginStateChanged"));
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };
  
  // Enhanced logout function
  const logout = () => {
    console.log("Logging out user");
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      
      setIsLoggedIn(false);
      setUserRole(null);
      
      window.dispatchEvent(new Event("loginStateChanged"));
      navigate("/");
      
      console.log("Logout complete, auth state cleared");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthProvider;