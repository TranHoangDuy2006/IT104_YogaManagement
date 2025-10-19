import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../src/stores/userStore";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const userState = useSelector((state: RootState) => state.user);
  const reduxUser = userState.data;
  let currentUser = reduxUser;
  if (!currentUser) {
    try {
      currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
      currentUser = null;
    }
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (window.location.pathname.startsWith('/admin') && currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin' && window.location.pathname.startsWith('/admin')) {
    return children;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
