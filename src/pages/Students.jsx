import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeToStudents, addStudent } from "../services/students";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("6");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToStudents((studentsData) => {
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
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
      await addStudent(fullName.trim(), gradeNumber);

      setFullName("");
      setGrade("6");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

      <h1>Student Accounts</h1>

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
