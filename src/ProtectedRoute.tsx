import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../src/stores/userStore";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const userState = useSelector((state: RootState) => state.user);
  const isAuthenticated = Boolean(userState.data);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
