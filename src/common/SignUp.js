import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import AuthContext from "../context/auth-context";
import TaskContext from "../context/task-context";
import Jabber from "jabber";
import manual_user_credentials from "../manual_user_credentials.json";

const SignUp = () => {
  const jabber = new Jabber();
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
    // check if username and password are in the manual_user_credentials.json file
    let found = false;
    manual_user_credentials.forEach((user) => {
      if (user.email === email && user.password === password) {
        found = true;
      }
    });
    if (!found) {
      alert("Please make sure you are using the correct email and password");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let user = userCredential.user;
      let currentdate = new Date();
      // expiration date is current date + 1 day
      let expiration_date = new Date();
      expiration_date.setDate(currentdate.getDate() + 1);
      user = { ...user, expiration_date: expiration_date };
      console.log("Signed up user:", user);
      // login the user
      authCtx.login(user);
      // delay to ensure the user is logged in before navigating
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Redirect to login page after successful sign up
      navigate("/chat");
    } catch (error) {
      // if the error is due to the user already existing, alert the user
      if (error.code === "auth/email-already-in-use") {
        alert("User already exists. Sign up with a different credentials.");
        return;
      }

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
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-600">
            Enter the email address you were assigned.
          </p>

          <input
            type="email"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={email}
            required
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className="text-sm text-gray-600 ">
            Enter the password you were assigned
          </p>

          <input
            type="text"
            className="w-[20rem] bg-[#FFFFFF] h-8 text-black rounded py-2 px-3"
            value={password}
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
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
            Log in instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
