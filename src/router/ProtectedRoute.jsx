import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const staffDoc = await getDoc(doc(db, "staff", user.uid));
      setAllowed(staffDoc.exists());
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
