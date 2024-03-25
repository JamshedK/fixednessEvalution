import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import AuthContext from "../context/auth-context";
import TaskContext from "../context/task-context";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Signed up user:", user);
      // login the user
      authCtx.login(user);
      // assing a task to the user
      taskCtx.setTasks(user);
      // Redirect to login page after successful sign up
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex items-center justify-center">
      <div className="bg-[#e3e3e3] max-w-[30rem] p-6 rounded-lg flex flex-col items-center">
        <form
          onSubmit={handleSignUp}
          className="flex flex-col items-center space-y-6 px-16 mt-[4rem]"
        >
          <input
            type="email"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={email}
            required
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={password}
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="Verify password"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={verifyPassword}
            required
            placeholder="Verify password"
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
        </form>
        <div className="flex flex-col w-full items-center justify-end space-y-8 mb-4 mt-2">
          <button
            type="submit"
            className="w-fit bg-white text-black py-2 px-8 rounded-xl mt-"
            onClick={handleSignUp}
          >
            {" "}
            Sign Up
          </button>
          <button
            className="text-black w-fit underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
