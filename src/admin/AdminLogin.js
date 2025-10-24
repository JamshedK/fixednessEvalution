import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import AuthContext from "../context/auth-context";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Admin user logged in:", user.uid);
      
      // First, just authenticate with Firebase
      // Don't call authCtx.login yet to avoid duplicate admin checks
      
      // Check admin status directly
      const isUserAdmin = await authCtx.checkAdminStatus(user.uid, user.email);
      
      console.log("Admin status check result:", isUserAdmin);
      
      // Check if user is actually an admin
      if (isUserAdmin) {
        console.log("Admin verified, logging in user");
        // Only login if admin check passes
        await authCtx.login(user, password);
        console.log("Navigating to admin dashboard");
        navigate("/admin/dashboard");
      } else {
        // Not an admin, don't login at all
        console.log("Access denied - not an admin");
        alert("Access denied. You are not authorized as an admin.");
      }
    } catch (error) {
      console.error("Error logging in as admin:", error);
      alert("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex items-center justify-center">
      <div className="bg-[#e3e3e3] max-w-[30rem] p-6 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Admin Login</h2>
        <form
          onSubmit={handleAdminLogin}
          className="flex flex-col items-center space-y-6 px-16 mt-[2rem]"
        >
          <input
            type="email"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={email}
            required
            placeholder="Admin Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={password}
            required
            placeholder="Admin Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit bg-white text-black py-2 px-8 rounded-xl disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>
        <div className="flex flex-col w-full items-center justify-end space-y-4 mt-8 mb-[3rem]">
          <button
            className="text-black w-fit underline"
            onClick={() => navigate("/login")}
          >
            Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
