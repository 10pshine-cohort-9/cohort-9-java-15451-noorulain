
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  let token = null;

  try {
    token = localStorage.getItem("token");
  } catch (error) {
    console.error("Unable to access local storage.");
  }

  return token ? children : <Navigate to="/login" replace />;
}

