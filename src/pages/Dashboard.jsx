import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const checkStaff = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/");
        return;
      }

      const staffRef = doc(db, "staff", user.uid);
      const staffSnap = await getDoc(staffRef);

      if (
        !staffSnap.exists() ||
        staffSnap.data().school !== "Washington Manor Middle School"
      ) {
        await auth.signOut();
        navigate("/");
        return;
      }

      setLoading(false);
    };

    checkStaff();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <h1>BGC Bucks Banking</h1>
        <p>Washington Manor Middle School</p>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          maxWidth: "300px",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => navigate("/students")}
      >
        <h3>Manage Students</h3>
        <p>View, search, add, or remove student accounts</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
