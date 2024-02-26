import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/auth-context";

const Logout = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    authCtx.logout();
    localStorage.clear();
    navigate("/login", { replace: true }); // Redirect to login page after logout
  }, [authCtx, navigate]);

  return null;
};

export default Logout;
