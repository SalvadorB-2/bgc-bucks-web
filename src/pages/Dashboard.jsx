import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Search,
} from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div classname="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            BGC Bucks Banking
          </h1>
          <p className="text-gray-600">Boys and Girls Club Staff Portal</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <a
            onClick={() => navigate("/students")}
            className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow w-full"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Manage Students
                </h3>
                <p className="text-gray-600">
                  View, search, add, or remove student accounts
                </p>
              </div>
            </div>
          </a>
        </div>
        {/* Stats */}
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Deposits
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">$12,345</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Withdrawals
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">$8,765</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Active Students
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">150</p>
            </div>
          </div> */}
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
