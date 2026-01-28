import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useRoleBasedNavigation = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const navigateToDashboard = () => {
    if (role === "clinic") {
      navigate("/clinic/dashboard");
    } else if (role === "patient") {
      navigate("/patient/dashboard");
    } else {
      navigate("/");
    }
  };

  return { navigateToDashboard, navigate };
};
