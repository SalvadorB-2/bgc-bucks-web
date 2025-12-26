import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, serverTimestamp } from "firebase/firestore";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("6");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchStudents = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "students"),
      where("school", "==", "Washington Manor Middle School")
    );

    const snapshot = await getDocs(q);
    const studentList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setStudents(studentList);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toString() == searchTerm
  );

  const handleAddStudent = async () => {
    if (!fullName.trim()) {
      alert("Student name is required");
      return;
    }

    const gradeNumber = Number(grade);
    if (![6, 7, 8].includes(gradeNumber)) {
      alert("Grade must be 6, 7, or 8");
      return;
    }

    try {
      await addDoc(collection(db, "students"), {
        fullName: fullName.trim(),
        grade: gradeNumber,
        balance: 0,
        school: "Washington Manor Middle School",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      //Reset form
      setFullName("");
      setGrade("6");
      setShowForm(false);

      //Refresh List
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div>
      <h1>Student Accounts</h1>

      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

      <div>
        <input
          type="text"
          placeholder="Search by name or grade"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button>Search</button>
        <button onClick={() => setShowForm(true)}>Add Student</button>
      </div>

      <div>
        {showForm && (
          <div>
            <h3>Add Student</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>

            <button onClick={handleAddStudent}>Add Student</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}
      </div>

      <hr />

      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <strong>{student.fullName}</strong> | Grade {student.grade} |
            Balance: {student.balance} BGC Bucks
            <button onClick={() => navigate(`/students/${student.id}`)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Students;
