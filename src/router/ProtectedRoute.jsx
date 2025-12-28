import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscrbe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const staffRef = doc(db, "staff", user.uid);
        const staffSnap = await getDoc(staffRef);

        setAllowed(staffSnap.exists());
      } catch (error) {
        console.error("Auth check failed:", error);
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscrbe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
