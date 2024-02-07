import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase-config";
import AuthContext from "../context/auth-context";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const authCtx = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Logged in user:", user);
            // Login the user
            authCtx.login(user);
            // Redirect to home page after successful login
            navigate("/");
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Invalid email or password. Please try again.");
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log("Logged in user (Google):", user);
            // Login the user
            authCtx.login(user);
            // Redirect to home page after successful login
            navigate("/");
        } catch (error) {
          console.error("Error logging in with Google:", error);
          alert("An error occurred while logging in with Google. Please try again.");
        }
      };

    return (
        <div className="bg-[#2F4454] min-h-screen flex items-center justify-center">
            <div className="bg-[#142838] max-w-[30rem] p-6 rounded-lg flex flex-col items-center">
                <form onSubmit={handleLogin} className="flex flex-col items-center space-y-6 px-16 mt-[4rem]">
                <input
                    type="email"
                    className="w-[20rem] bg-[#2F4454] h-8 text-white rounded py-2 px-3"
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="w-[20rem] bg-[#2F4454] h-8 text-white rounded py-2 px-3"
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-fit bg-white text-black py-2 px-8 rounded-xl"
                >
                    Log In
                </button>
                </form>
                <div className="flex flex-col w-full items-center justify-end space-y-8 mb-[5rem]">
                <button
                    className="text-blue-300 w-fit underline"
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot Password
                </button>
                <button
                    className="text-blue-300 w-fit underline"
                    onClick={() => navigate("/signup")}
                >
                    Sign Up
                </button>
                <button className="text-blue-300 w-fit underline" onClick={handleGoogleLogin} >
                    Continue with Google
                </button>
                </div>
            </div>
        </div>
    );
    };

export default Login;
