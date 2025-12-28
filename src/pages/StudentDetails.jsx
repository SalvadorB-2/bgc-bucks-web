import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribeToStudent, deleteStudent } from "../services/students";
import {
  subscribeToTransactions,
  addDeposit,
  addWithdrawal,
} from "../services/transactions";

function StudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [category, setCategory] = useState("Snacks");

  useEffect(() => {
    const unsubStudent = subscribeToStudent(studentId, setStudent);
    const unsubTx = subscribeToTransactions(studentId, setTransactions);

    return () => {
      unsubStudent();
      unsubTx();
    };
  }, [studentId]);

  const handleDeleteStudent = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      await deleteStudent(studentId);
      navigate("/students");
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    await addDeposit(studentId, Number(depositAmount));
    setDepositAmount("");
    setShowDeposit(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    await addWithdrawal(studentId, Number(withdrawAmount), category);
    setWithdrawAmount("");
    setShowWithdraw(false);
  };

  if (!student) return <p>Loading student...</p>;

  return (
    <div>
      <button onClick={() => navigate("/students")}>Back to Students</button>

      <div className="student-card">
        <div className="header">
          <h2>{student.fullName}</h2>
          <p>Grade {student.grade}</p>
          <button className="delete-btn" onClick={handleDeleteStudent}>
            Delete Student
          </button>
        </div>

        <div className="balance-section">Balance: ${student.balance}</div>

        <div className="actions">
          <button onClick={() => setShowDeposit(!showDeposit)}>Deposit</button>
          <button onClick={() => setShowWithdraw(!showWithdraw)}>
            Withdraw
          </button>
        </div>

        {showDeposit && (
          <div className="form-extension">
            <h3>BGC Deposit Form</h3>
            <p>Quick Amounts</p>
            {[1, 3, 5].map((val) => (
              <button key={val} onClick={() => setDepositAmount(val)}>
                ${val}
              </button>
            ))}
            <p>Custom Amount</p>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Confirm Deposit</button>
            <button onClick={() => setShowDeposit(false)}>Cancel</button>
          </div>
        )}

        {showWithdraw && (
          <div className="form-extension">
            <h3>BGC Withdraw Form</h3>
            <p>Amount</p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <p>Select Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="snacks">Snacks</option>
              <option value="drink">Drink</option>
              <option value="toys">Toys / Gadgets</option>
              <option value="other">Other</option>
            </select>
            <button onClick={handleWithdraw}>Confirm Withdraw</button>
            <button onClick={() => setShowWithdraw(false)}>Cancel</button>
          </div>
        )}
      </div>
      <div className="transactions-card">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="transaction-row">
              <div>
                <strong>
                  {tx.type === "deposit" ? "Deposit" : "Withdraw"}
                </strong>
                <p>{new Date(tx.createdAt.seconds * 1000).toLocaleString()}</p>
              </div>
              <div className={tx.type === "deposit" ? "plus" : "minus"}>
                {tx.type === "deposit" ? "+" : "-"}${tx.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDetails;
