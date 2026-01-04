import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [schoolId, setSchoolId] = useState("washington_manor");
  const [siteCode, setSiteCode] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedSiteCode = siteCode.trim();

    if (!schoolId) {
      alert("Please select a school.");
      return;
    }

    if (trimmedSiteCode.length !== 5) {
      alert("Invalid site code.");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // Verify site code for selected school
      const schoolRef = doc(db, "schools", schoolId);
      const schoolSnap = await getDoc(schoolRef);

      if (!schoolSnap.exists()) {
        await auth.signOut();
        throw new Error("School does not exist.");
      }

      if (schoolSnap.data().siteCode !== trimmedSiteCode) {
        await auth.signOut();
        alert("Incorrect site code.");
        return;
      }

      // All checks passed
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login fialed. Check crednetials.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Staff Login</h2>
        <div>
          {/* School Selection */}
          <select
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
          >
            <option value="washington_manor">
              Washington Manor Middle School
            </option>
          </select>

          {/* Site Code Input */}
          <input
            type="text"
            placeholder="Site Code"
            value={siteCode}
            onChange={(e) => setSiteCode(e.target.value)}
            maxLength={5}
            required
          />
        </div>
        <div>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
