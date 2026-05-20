import { useAuth } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
    const { loading, currentUser, isAuthenticated } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Check roles if allowedRole is provided
    if (allowedRole) {
        // If it's an array, check if the current user's role is in the array
        if (Array.isArray(allowedRole)) {
            if (!allowedRole.includes(currentUser?.role)) {
                return <Navigate to="/login" replace />;
            }
        } else {
            // Otherwise do a strict string comparison
            if (currentUser?.role !== allowedRole) {
                return <Navigate to="/login" replace />;
            }
        }
    }
    
    return children;
}